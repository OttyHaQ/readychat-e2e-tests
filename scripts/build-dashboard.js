/**
 * Reads Playwright JSON results, appends to persistent history,
 * and generates playwright-report/dashboard.html.
 *
 * Run after `npm test` in CI:
 *   node scripts/build-dashboard.js
 *
 * Expects playwright-report/test-history.json to already exist
 * (downloaded from GitHub Pages by the CI workflow before this runs).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const RESULTS_FILE  = 'test-results/results.json';
const HISTORY_FILE  = 'playwright-report/test-history.json';
const DASHBOARD_FILE = 'playwright-report/dashboard.html';

// ── 1. Read Playwright JSON output ────────────────────────────────────────────
if (!existsSync(RESULTS_FILE)) {
  console.warn('No test-results/results.json found — skipping dashboard build.');
  process.exit(0);
}

const results = JSON.parse(readFileSync(RESULTS_FILE, 'utf-8'));
const { stats } = results;

// ── 2. Extract per-test results ───────────────────────────────────────────────
const testResults = [];

function extractTests(suite, featurePath = '') {
  const label = suite.title || featurePath;
  for (const spec of (suite.specs || [])) {
    for (const test of (spec.tests || [])) {
      const last = test.results?.[test.results.length - 1] ?? {};
      testResults.push({
        title:    spec.title,
        feature:  label,
        project:  test.projectName || '',
        status:   test.status,   // 'expected' | 'unexpected' | 'skipped' | 'flaky'
        duration: last.duration  || 0,
        retries:  (test.results?.length ?? 1) - 1,
        error:    last.errors?.[0]?.message?.slice(0, 300) ?? null,
      });
    }
  }
  for (const child of (suite.suites || [])) {
    extractTests(child, label || featurePath);
  }
}

for (const suite of (results.suites || [])) extractTests(suite);

// ── 3. Build history entry ────────────────────────────────────────────────────
const entry = {
  timestamp: stats.startTime,
  date:      stats.startTime.split('T')[0],
  passed:    stats.expected,
  failed:    stats.unexpected,
  flaky:     stats.flaky  || 0,
  skipped:   stats.skipped || 0,
  total:     stats.expected + stats.unexpected + (stats.skipped || 0),
  duration:  Math.round(stats.duration / 1000),
  ok:        stats.unexpected === 0,
  tests:     testResults,
};

// ── 4. Load + append + prune history ─────────────────────────────────────────
let history = existsSync(HISTORY_FILE)
  ? JSON.parse(readFileSync(HISTORY_FILE, 'utf-8'))
  : [];

history.push(entry);

// Keep last 90 days
const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
history = history.filter(e => e.timestamp >= cutoff);
history.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
console.log(`History: ${history.length} runs stored. Latest: ${entry.date} — ${entry.passed} passed, ${entry.failed} failed`);

// ── 5. Generate dashboard HTML ────────────────────────────────────────────────
writeFileSync(DASHBOARD_FILE, generateDashboard(history));
console.log(`Dashboard written → ${DASHBOARD_FILE}`);

// ─────────────────────────────────────────────────────────────────────────────

function generateDashboard(history) {
  const latest = history[history.length - 1] ?? { passed: 0, failed: 0, total: 0, duration: 0, ok: true };
  const passRate = latest.total > 0 ? ((latest.passed / latest.total) * 100).toFixed(1) : '—';
  const fmtDuration = s => s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

  // Compute "most failing tests" across all history
  const failMap = {};
  for (const run of history) {
    for (const t of (run.tests || [])) {
      if (t.status === 'unexpected') {
        const key = `${t.feature} › ${t.title}`;
        failMap[key] = (failMap[key] || 0) + 1;
      }
    }
  }
  const topFailing = Object.entries(failMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Compute "most flaky tests"
  const flakyMap = {};
  for (const run of history) {
    for (const t of (run.tests || [])) {
      if (t.status === 'flaky') {
        const key = `${t.feature} › ${t.title}`;
        flakyMap[key] = (flakyMap[key] || 0) + 1;
      }
    }
  }
  const topFlaky = Object.entries(flakyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentRuns = [...history].reverse().slice(0, 15);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ReadyChatAI — Test Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f6fa; color: #1a1a2e; }
  header { background: #1a1a2e; color: #fff; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; }
  header h1 { font-size: 1.3rem; font-weight: 600; letter-spacing: -0.3px; }
  header .meta { font-size: 0.78rem; opacity: 0.6; }
  main { max-width: 1200px; margin: 0 auto; padding: 28px 20px; }

  /* Cards */
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .card { background: #fff; border-radius: 12px; padding: 20px 22px; box-shadow: 0 1px 4px rgba(0,0,0,.07); }
  .card .label { font-size: 0.73rem; text-transform: uppercase; letter-spacing: .5px; color: #666; margin-bottom: 8px; }
  .card .value { font-size: 2rem; font-weight: 700; line-height: 1; }
  .card .sub   { font-size: 0.78rem; color: #888; margin-top: 5px; }
  .card.pass   .value { color: #16a34a; }
  .card.fail   .value { color: #dc2626; }
  .card.rate   .value { color: #2563eb; }
  .card.dur    .value { color: #9333ea; }
  .status-ok   { color: #16a34a; font-weight: 600; }
  .status-fail { color: #dc2626; font-weight: 600; }

  /* Sections */
  .section { background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.07); padding: 22px 24px; margin-bottom: 24px; }
  .section h2 { font-size: 0.95rem; font-weight: 600; margin-bottom: 16px; color: #1a1a2e; }
  .section h2 .chip { display: inline-block; font-size: 0.68rem; background: #f0f0f5; border-radius: 4px; padding: 2px 7px; margin-left: 8px; color: #555; font-weight: 500; vertical-align: middle; }

  /* Period selector */
  .period-bar { display: flex; gap: 6px; margin-bottom: 18px; }
  .period-bar button { padding: 5px 14px; border-radius: 6px; border: 1px solid #e0e0e0; background: #fff; font-size: 0.8rem; cursor: pointer; color: #444; transition: all .15s; }
  .period-bar button.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }

  /* Chart wrapper */
  .chart-wrap { position: relative; height: 280px; }

  /* Table */
  table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
  th { text-align: left; padding: 8px 10px; color: #555; font-weight: 600; font-size: 0.73rem; text-transform: uppercase; letter-spacing: .4px; border-bottom: 2px solid #f0f0f5; }
  td { padding: 9px 10px; border-bottom: 1px solid #f6f6f9; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafafa; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.72rem; font-weight: 600; }
  .badge.ok    { background: #dcfce7; color: #16a34a; }
  .badge.fail  { background: #fee2e2; color: #dc2626; }
  .bar-cell { display: flex; align-items: center; gap: 8px; }
  .mini-bar { flex: 1; height: 6px; background: #f0f0f5; border-radius: 3px; overflow: hidden; max-width: 100px; }
  .mini-bar-fill { height: 100%; background: #16a34a; border-radius: 3px; }
  .num { font-variant-numeric: tabular-nums; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 720px) { .two-col { grid-template-columns: 1fr; } .cards { grid-template-columns: 1fr 1fr; } }

  .empty { color: #aaa; font-size: 0.85rem; padding: 16px 0; }
</style>
</head>
<body>

<header>
  <h1>ReadyChatAI — Test Observability Dashboard</h1>
  <span class="meta">Last updated: ${new Date(latest.timestamp || Date.now()).toUTCString()}</span>
</header>

<main>

  <!-- Summary cards -->
  <div class="cards">
    <div class="card rate">
      <div class="label">Pass Rate</div>
      <div class="value">${passRate}${passRate !== '—' ? '%' : ''}</div>
      <div class="sub">Latest run · ${latest.total} tests</div>
    </div>
    <div class="card pass">
      <div class="label">Passed</div>
      <div class="value">${latest.passed}</div>
      <div class="sub">${latest.flaky ? `+${latest.flaky} flaky` : 'No flaky tests'}</div>
    </div>
    <div class="card fail">
      <div class="label">Failed</div>
      <div class="value">${latest.failed}</div>
      <div class="sub">${latest.skipped} skipped</div>
    </div>
    <div class="card dur">
      <div class="label">Duration</div>
      <div class="value" style="font-size:1.6rem">${fmtDuration(latest.duration)}</div>
      <div class="sub">Latest run</div>
    </div>
    <div class="card">
      <div class="label">Runs Tracked</div>
      <div class="value" style="font-size:1.6rem">${history.length}</div>
      <div class="sub">Last 90 days</div>
    </div>
  </div>

  <!-- Trend chart -->
  <div class="section">
    <h2>Pass / Fail Trend</h2>
    <div class="period-bar">
      <button class="active" onclick="setPeriod('daily',this)">Daily</button>
      <button onclick="setPeriod('weekly',this)">Weekly</button>
      <button onclick="setPeriod('monthly',this)">Monthly</button>
    </div>
    <div class="chart-wrap">
      <canvas id="trendChart"></canvas>
    </div>
  </div>

  <!-- Recent runs + top failing side by side -->
  <div class="two-col">

    <!-- Recent runs -->
    <div class="section">
      <h2>Recent Runs <span class="chip">last ${recentRuns.length}</span></h2>
      <table>
        <thead><tr>
          <th>Date</th>
          <th>Result</th>
          <th>Pass %</th>
          <th>Failed</th>
          <th>Duration</th>
        </tr></thead>
        <tbody>
          ${recentRuns.map(r => {
            const rate = r.total > 0 ? ((r.passed / r.total) * 100).toFixed(0) : 0;
            return `<tr>
              <td class="num">${r.date}</td>
              <td><span class="badge ${r.ok ? 'ok' : 'fail'}">${r.ok ? 'PASS' : 'FAIL'}</span></td>
              <td>
                <div class="bar-cell">
                  <div class="mini-bar"><div class="mini-bar-fill" style="width:${rate}%"></div></div>
                  <span class="num">${rate}%</span>
                </div>
              </td>
              <td class="num ${r.failed > 0 ? 'status-fail' : ''}">${r.failed}</td>
              <td class="num">${fmtDuration(r.duration)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Most failing tests -->
    <div class="section">
      <h2>Most Failing Tests <span class="chip">all time</span></h2>
      ${topFailing.length === 0
        ? '<p class="empty">No test failures recorded yet.</p>'
        : `<table>
          <thead><tr><th>Test</th><th>Failures</th></tr></thead>
          <tbody>
            ${topFailing.map(([name, count]) => `<tr>
              <td style="font-size:0.79rem;word-break:break-word">${name}</td>
              <td class="num status-fail">${count}</td>
            </tr>`).join('')}
          </tbody>
        </table>`}

      ${topFlaky.length > 0 ? `
        <h2 style="margin-top:24px">Flaky Tests <span class="chip">passed after retry</span></h2>
        <table>
          <thead><tr><th>Test</th><th>Times flaky</th></tr></thead>
          <tbody>
            ${topFlaky.map(([name, count]) => `<tr>
              <td style="font-size:0.79rem;word-break:break-word">${name}</td>
              <td class="num" style="color:#d97706">${count}</td>
            </tr>`).join('')}
          </tbody>
        </table>` : ''}
    </div>

  </div>

</main>

<script>
const HISTORY = ${JSON.stringify(history)};

// ── Aggregation helpers ───────────────────────────────────────────────────────
function groupBy(runs, keyFn) {
  const map = {};
  for (const r of runs) {
    const k = keyFn(r);
    if (!map[k]) map[k] = { label: k, passed: 0, failed: 0, flaky: 0, total: 0, runs: 0 };
    map[k].passed += r.passed;
    map[k].failed += r.failed;
    map[k].flaky  += r.flaky || 0;
    map[k].total  += r.total;
    map[k].runs   += 1;
  }
  return Object.values(map).sort((a,b) => a.label.localeCompare(b.label));
}

function isoWeek(dateStr) {
  const d = new Date(dateStr);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - jan1) / 86400000) + 1) / 7);
  return d.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

const PERIODS = {
  daily:   r => r.date,
  weekly:  r => isoWeek(r.date),
  monthly: r => r.date.slice(0, 7),
};

// ── Chart setup ───────────────────────────────────────────────────────────────
const ctx = document.getElementById('trendChart').getContext('2d');
let chart;

function renderChart(period) {
  const groups = groupBy(HISTORY, PERIODS[period]);

  // Limit to last 30 daily / 12 weekly / 12 monthly points
  const limits = { daily: 30, weekly: 12, monthly: 12 };
  const pts = groups.slice(-limits[period]);

  const labels    = pts.map(g => g.label);
  const passed    = pts.map(g => g.passed);
  const failed    = pts.map(g => g.failed);
  const passRates = pts.map(g => g.total > 0 ? +((g.passed / g.total) * 100).toFixed(1) : null);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Passed',
          data: passed,
          backgroundColor: 'rgba(22,163,74,0.75)',
          stack: 'counts',
          order: 2,
        },
        {
          label: 'Failed',
          data: failed,
          backgroundColor: 'rgba(220,38,38,0.75)',
          stack: 'counts',
          order: 2,
        },
        {
          label: 'Pass Rate %',
          data: passRates,
          type: 'line',
          borderColor: '#2563eb',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#2563eb',
          yAxisID: 'rate',
          order: 1,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { font: { size: 12 }, boxWidth: 12, padding: 16 } },
        tooltip: {
          callbacks: {
            footer: items => {
              const total = (items[0]?.raw || 0) + (items[1]?.raw || 0);
              return total ? 'Total: ' + total : '';
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          stacked: true,
          title: { display: true, text: 'Tests', font: { size: 11 } },
          ticks: { precision: 0 },
        },
        rate: {
          position: 'right',
          min: 0, max: 100,
          title: { display: true, text: 'Pass Rate %', font: { size: 11 } },
          grid: { drawOnChartArea: false },
          ticks: { callback: v => v + '%', font: { size: 11 } },
        },
      },
    },
  });
}

function setPeriod(period, btn) {
  document.querySelectorAll('.period-bar button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderChart(period);
}

renderChart('daily');
</script>
</body>
</html>`;
}
