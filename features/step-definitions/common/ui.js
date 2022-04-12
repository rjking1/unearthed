// import { And, Given, Then, When } from "cypress-cucumber-preprocessor/steps";
const { Given, When, Then } = require('@wdio/cucumber-framework');
const {
  compareFiles,
  // compareFilesWithIgnoreOption,
  downloadAsCSV,
  cleanFilesInDir,
  saveTableToString,
  compareStringUsingRegExp,
  compareString
} = require("../common/utils.js");

Then("I can see {string}", (str) => {
  cy.contains(str).should("exist");
});

Then("I cannot see {string}", (str) => {
  cy.contains(str).should("not.exist");
});

Then("go to {string}", async (str) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  // cy.wait(1000);
  // cy.contains(str).click();
  await $(`button*=${str}`).click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  // cy.wait(500);
});

When("save {string} to csv", async (str) => {
  // cy.contains(str).click();
  await $(`button*=${str}`).click();
  
  // cy.contains("Save to CSV file").click(); // button at bottom of a table
  await $(`button=Save to CSV file`).click();

  await browser.pause(500);  // without this we get the fiie but with a temp file name

  // comp : no file mgmt like cy
  // downloaded file goes to Download folder 
  // with random.tmp filename !? HOw to deal with this?
  // see this: https://blog.kevinlamping.com/downloading-files-using-webdriverio/
  
  // todo
  // will get quoted cells if we use utils.exportTableToCSV()
  // which is what Save To CSV button should use
});

Then("save table {string} to file {string}", async (selector, fileName) => {
  await downloadAsCSV(await $(selector), fileName);
  //cy.get(selector);
  // todo
  // will get quoted cells if we use utils.exportTableToCSV()
  // which is what Save To CSV button should use
});

Then("It should match the expected {string} csv file", async (str) => {
  compareFiles(
    `./download/${str}.csv`,
    `./expected/${str}.csv`
  );
});

Then("compare table {string} to file {string}", async (selector, fileName) => {
  const csv = await saveTableToString(selector);
  compareString(
    csv,
    `./expected/${fileName}.csv`
  );
});

Then("save chart {string}", (selector) => {
  // pybase prompts for file name
  // https://applitools.com/blog/testing-browser-alerts-confirmations-prompts-cypress/
  cy.window().then((win) => {
    cy.stub(win, "prompt").returns("saved_chart");
    cy.get(selector).within(() => {
      cy.get("a[data-title='Download data as csv']").click();
    });
  });
  // stub gets auto released at next scenario/test
  //waitForDownloadToComplete(3000);
});

Then("the saved chart should match the expected {string} csv file", (str) => {
  compareFilesWithIgnoreOption(
    `./download/saved_chart.csv`,
    `./expected/${str}.csv`,
    [0]
  );
});

Then("Clean download folder", async () => {
  await cleanFilesInDir('C:\\devel\\testing\\wdio\\ride_tracker_testing_wdio_bdd\\download')
})
