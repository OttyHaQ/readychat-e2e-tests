export class AIBot {
    constructor(page) {

        // Data Sources

        this.page = page;
        this.AIbot = page.locator('xpath=//div[contains(text(),"AI Bot")]');
        this.dataSources = page.locator('xpath=//a[normalize-space()="Data Sources"]');
        this.password = 'Nsisong03@@';

        //Q and A 
        this.QnA = page.locator('xpath=//span[normalize-space()="Q and A"]');
        this.allQstns = page.locator('body main div[class="flex justify-between items-center pb-4 ml-0 md:ml-4 pr-0 md:pr-4 overflow-auto gap-14"] div div:nth-child(2) span:nth-child(1)');
        this.unansweredQstns = page.locator('div[data-tour-target="faq-table"] div[class="flex gap-1 overflow-x-auto scrollbar-hide"] div:nth-child(1) span:nth-child(1)');
        this.reorderBtn = page.locator('button[class="h-full bg-gray-100 text-gray-700 border-2 border-brand-gray-200 p-4 text-base rounded-xl font-semibold transition-[colors,box-shadow] duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gray-100"]');
        this.saveBtn = page.locator('xpath=//button[normalize-space()="Save"]');
        this.cancelBtn = page.locator('xpath=//button[normalize-space()="Cancel"]');
        this.questionColumn = page.locator('xpath=//div[normalize-space()="Question"]');
        this.productsColumn = page.locator('xpath=//div[normalize-space()="Products"]');
        this.serviceColumn = page.locator('xpath=//div[normalize-space()="Service"]');
        this.lastAskedColumn = page.locator('xpath=//div[normalize-space()="Last Asked"]');
        this.channelsColumn = page.locator('xpath=//div[normalize-space()="Channels"]');
        this.statusColumn = page.locator('xpath=//div[normalize-space()="Status"]');
        this.actionsColumn = page.locator('xpath=//div[normalize-space()="Actions"]');
        this.answerColumn = page.locator('xpath=//div[normalize-space()="Answer"]');
        
        this.exportBtn = page.locator('xpath=//button[normalize-space()="Export"]');
        this.exportTableData = page.locator('xpath=//h3[normalize-space()="Export Table Data"]');
        this.exportRangeDropdown = page.locator('xpath=//div[contains(@class,"relative w-full flex flex-col items-start")]//button[contains(@type,"button")]');
        this.csvBtn = page.locator('xpath=//button[normalize-space()="CSV"]');
        this.xlsxBtn = page.locator('xpath=//button[normalize-space()="XLSX"]');
        this.pdfBtn = page.locator('xpath=//button[normalize-space()="PDF"]');

        this.addNewQstnsBtn = page.locator('xpath=//button[normalize-space()="Add New Questions"]');
        this.addQstnsAndAnswers = page.locator('xpath=//h3[normalize-space()="Add Question and Answer"]');
        this.questionField = page.locator('#question');
        this.answerField = page.locator('#answer');
        this.productsDropdown = page.locator('div[class="relative w-full tour-target-faq-product-dropdown"] button[class="w-full ps-4 pe-2 py-4 mt-2 text-left bg-white border border-brand-gray-100 rounded-xl shadow-sm focus:outline-none flex items-center justify-between"]');
        this.product = page.locator('tr[class="hover:bg-brand-gray-300 cursor-pointer "] td:nth-child(1)');
        this.servicesDropdown = page.locator('div[class="relative w-full tour-target-faq-service-dropdown"] button[class="w-full ps-4 pe-2 py-4 mt-2 text-left bg-white border border-brand-gray-100 rounded-xl shadow-sm focus:outline-none flex items-center justify-between"]');
        this.service = page.locator('tr[class="hover:bg-brand-gray-300 cursor-pointer "] td:nth-child(1)');
        this.saveAndColseBtn = page.locator('xpath=//button[normalize-space()="Save & Close"]');

        // Import Files
        this.importFiles = page.locator('xpath=//span[normalize-space()="Import Files"]');
        this.batchHeader = page.locator('.h4');
        this.idColumn = page.locator('xpath=//div[normalize-space()="ID"]');
        this.fileNameColumn = page.locator('xpath=//div[normalize-space()="File Name"]');
        this.createdAtColumn = page.locator('xpath=//div[normalize-space()="Created At"]');
        this.productCountColumn = page.locator('xpath=//div[normalize-space()="Product Count"]');
        this.statusColumn = page.locator('xpath=//div[normalize-space()="Status"]');
        this.actionsColumn = page.locator('xpath=//div[normalize-space()="Actions"]');
        

        // Add Source
        this.addSourceBtn = page.locator('button[class="bg-brand-secondary text-white px-6 py-4 text-base rounded-xl font-semibold transition-[colors,box-shadow] duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gray-100"]');
        this.addSourceHeader = page.locator('xpath=//h3[normalize-space()="Train your AI"]');
        this.createQandA = page.locator('xpath=//h6[normalize-space()="Create Q&A"]');
        this.importProductFile = page.locator('xpath=//h6[normalize-space()="Import Product File"]');
        this.importFilesHeader = page.locator('xpath=//h3[normalize-space()="Import Product File"]')
        this.downloadTemplateBtn = page.locator('xpath=//button[normalize-space()="Download CSV template"]');
        this.uploadFileBtn = 'input[type="file"]';
        this.importBtn = page.locator('xpath=//button[normalize-space()="Import"]');
        this.alert = page.locator('div[role="alert"] div:nth-child(2)');
        this.alert2 = page.locator('div[role="alert"] div:nth-child(1)');


        // Playground
        this.playground = page.locator('xpath=//a[normalize-space()="Playground"]');
        this.playgroundheader = page.locator('xpath=//h3[normalize-space()="ReadyChatAI"]');
        this.defaulttext = page.locator('.relative.p-3.rounded-lg.break-words.whitespace-pre-line');
        this.plagroundheader_2 = page.locator('.flex.flex-col.space-y-3');
        this.resetBtn = page.locator('xpath=//button[normalize-space()="Reset"]');
        this.prompt_1 = page.locator('xpath=//button[normalize-space()="Where are you located?"]');
        this.prompt_2 = page.locator('xpath=//button[normalize-space()="What are your business hours?"]');
        this.prompt_3= page.locator('xpath=//button[normalize-space()="Show me your products"]');
        this.prompt_4 = page.locator('xpath=//button[normalize-space()="I want to make an order"]');
        this.inputField = page.locator('input[placeholder="Type a reply..."]');
        this.emojiButton = page.locator('.ri-emotion-line.text-3xl.text-brand-gray-200');
        this.emoji = page.locator('xpath=//span[contains(text(),"😀")]');
        this.sendBtn = page.locator('.bg-brand-secondary-gradient.rounded-full.w-fit.h-fit.p-3.cursor-pointer.flex.items-center.justify-center');
        this.addMoreLink = page.locator('p[class="mt-1 text-sm text-blue-600 text-brand-secondary underline font-bold mt-0"] a');
        this.sentMessage = page.locator('main >> text=I want to make an order');
        // this.botReply = page.locator('xpath=//p[contains(text(),"What would you like to order?")]');


        // Configure
        this.configure = page.locator('//a[normalize-space()="Configure"]');
        this.professionalInfoField = page.locator('textarea[id="responses.0.response"]');
        this.aiTone = page.locator('textarea[id="responses.1.response"]');
        this.generalToggle1 = page.locator(':nth-child(3) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle2 = page.locator(':nth-child(4) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle3 = page.locator(':nth-child(5) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle4 = page.locator(':nth-child(6) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle5 = page.locator(':nth-child(7) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle6 = page.locator(':nth-child(8) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle7 = page.locator(':nth-child(9) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle8 = page.locator('body > main:nth-child(112) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(1) > div:nth-child(10) > label:nth-child(1) > div:nth-child(2) > div:nth-child(2)')
        this.aiModelBtn1 = page.locator('.space-x-4 > :nth-child(1) > .relative > .absolute');
        this.aiModelBtn2 = page.locator('.space-x-4 > :nth-child(2) > .relative > .absolute');
        this.yesBtn = page.locator('input[value="Yes"]');
        this.noBtn = page.locator('input[value="No"]');
        this.createRuleBtn = page.locator('xpath=//button[normalize-space()="Create Rule"]');
        this.platformDropdown = page.getByRole('button', { name: 'Select an option' });
        this.selectFB = page.getByRole('option', { name: 'Facebook' });
        this.selectIG = page.getByRole('option', { name: 'Instagram' });
        this.accountDropdown = page.getByRole('button', { name: 'Select an option' });
        this.selectFBAccount = page.getByRole('option', { name: 'The goodfood' });
        this.selectIGAccount = page.getByRole('option', { name: 'Food Vendor in Lagos' });
        this.continueBtn = page.getByRole('button', { name: 'Select Platform & Account' });
        this.nextBtn = page.getByRole('button', { name: 'Next' });
        this.commentsToggle = page.getByRole('checkbox', { name: 'Comments' });
        this.commentsLabel = page.locator('label:has-text("Comments")');
        this.dmToggle = page.getByRole('checkbox', { name: 'Direct Messages' });
        this.dmLabel = page.locator('label:has-text("Direct Messages")');
        this.modal = page.getByRole('dialog', { name: /configure response settings/i });
        this.minLikesRequiredField = page.locator('#min-likes')
        this.defaultReplyField = page.getByRole('textbox', { name: /default reply/i });
        this.keywordField = page.getByRole('textbox', { name: /keyword/i });
        this.addBtn = page.locator('xpath=(//button[contains(@class,"h-14 mt-8 bg-brand-secondary text-white px-6 py-4 text-base rounded-xl font-semibold transition-[colors,box-shadow] duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gray-100")])[1]');
        this.saveChangesBtn = page.getByRole('button', { name: 'Save Changes' });
        this.maxRepliesField = page.getByRole('spinbutton').nth(0);
        this.maxRepliesDayField = page.getByRole('spinbutton').nth(1);
        this.minLikesField = page.getByRole('spinbutton').nth(2);
        this.createRuleBtnMain = page
        .getByRole('heading', { name: 'Social media auto-reply settings' })
        .locator('..')
        .getByRole('button', { name: 'Create Rule' });
        this.createRuleBtn = page.locator('xpath=(//button[contains(@class,"text-sm md:text-base w-full bg-brand-secondary text-white px-6 py-4 text-base rounded-xl font-semibold transition-[colors,box-shadow] duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gray-100")])[1]');
        
        // Facebook rules
        this.facebookRules = page.getByRole('heading', { name: 'Facebook Rules' });
        this.fbDeleteBtn = page.locator('button:has(svg.remixicon.text-brand-red-500)').nth(0);
        this.fbToggle = page.locator('body > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > button:nth-child(2)');
        this.fbCommentsToggle = page.locator('body > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > label:nth-child(1) > div:nth-child(2) > div:nth-child(2)');
        this.fbDirectMessagesToggle = page.locator('body > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > label:nth-child(1) > div:nth-child(2) > div:nth-child(2)');
        this.fbGeneralBtn = page.locator('body > main:nth-child(110) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)');
        this.fbMessagesBtn = page.locator('xpath=(//span[contains(text(),"Messages")])[1]');
        this.fbAdvancedBtn = page.locator('xpath=(//span[contains(text(),"Advanced")])[1]');
        

        // Instagram rules
        this.instagramRules = page.getByRole('heading', { name: 'Instagram Rules' });
        this.igDeleteBtn = page.locator('button:has(svg.remixicon.text-brand-red-500)').nth(1);
        this.igToggle = page.locator('body > main:nth-child(110) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > div:nth-child(1) > label:nth-child(1) > div:nth-child(2) > div:nth-child(2)');
        this.igCommentsBtn = page.locator('body > main:nth-child(110) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > label:nth-child(1) > div:nth-child(2) > div:nth-child(2)');
        this.igGeneralBtn = page.locator('body > main:nth-child(110) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)');
        this.igMessagesBtn = page.locator('body > main:nth-child(110) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)');
        this.igAdvancedBtn = page.locator('body > main:nth-child(110) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > span:nth-child(1)');

    }

};