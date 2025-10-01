export class Escalation {
  constructor(page) {
    this.page = page;
    this.menu = page.locator('button[class="xl:hidden rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"] svg');
    this.escalation = page.locator('xpath=//div[contains(text(),"Escalation")]');
    this.my_tickets = page.locator('xpath=//span[normalize-space()="My Tickets"]');
    this.unassigned = page.locator('xpath=//span[normalize-space()="Unassigned"]');
    this.resolved = page.locator('xpath=//span[normalize-space()="Resolved"]');
    this.closed = page.locator('xpath=//span[normalize-space()="Closed"]');
    this.searchField = page.locator('input[placeholder="Search..."]');
    this.sortDropdown = page.locator('xpath=//main[@class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100"]//div[1]//div[1]//div[2]//div[1]//div[1]//div[1]//button[1]');
    this.all = page.locator('div[class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 outline-none bg-gray-100 bg-gray-50 "]');
    this.high = page.locator('xpath=//span[normalize-space()="High"]');
    this.medium = page.locator('xpath=//span[normalize-space()="Medium"]');
    this.low = page.locator('xpath=//span[normalize-space()="Low"]');
    this.filterLanguageDropdown = page.locator('body > main:nth-child(112) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)')
    this.allLanguages = page.locator('xpath=//span[normalize-space()="All Languages"]');
    this.english = page.locator('xpath=//span[normalize-space()="English"]');
    this.escalationToggle = page.locator('xpath=//div[contains(@class,"peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-brand-gray-100")]');
    this.acceptBtn = page.locator('xpath=//button[normalize-space()="Accept"]');
    this.chatBtn = page.locator('xpath=//button[normalize-space()="Chat"]');
    this.resolveBtn = page.locator('xpath=//button[normalize-space()="Resolve"]');
    this.reopenBtn = page.locator('xpath=//button[normalize-space()="Reopen"]');
    this.closeBtn = page.locator('xpath=//button[normalize-space()="Close"]');
    this.chatTitle = page.locator('xpath=//h4[normalize-space()="TICKET DETAILS"]');
    this.generateBtn = page.locator('xpath=//button[normalize-space()="Generate"]');
    this.closeModal = page.locator('');
    this.chatResolveBtn = page.locator('xpath=//div[@class="hidden sm:flex w-1/3 pr-4 items-center border-r border-gray-200"]//button[@class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"][normalize-space()="Resolve Ticket"]');
    this.current_option = page.locator('[role="option"]:has(svg)');
    this.status_options = page.locator('[role="option"]');
  };

  async sortBy() {
    const options = await this.status_options.allTextContents();
    
    for (const option of options) {
      
      await this.sortDropdown.click();
  
      await this.page.locator(`[role="option"]:has-text("${option}")`).click();

      await expect(this.sortDropdown).toHaveText(option);

      console.log(`✅ Successfully selected and validated: ${option}`);

      await expect(this.sortDropdown).toContainText(option);

      await this.page.waitForTimeout(1000);

    };
  };
}