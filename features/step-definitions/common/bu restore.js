
// import { And } from "cypress-cucumber-preprocessor/steps";
const { Given, When, Then } = require('@wdio/cucumber-framework');

const BU_FILE_NAME = "test"; // .sql
const TEST_DB = "test";

Then("Backup the {string} db", async (db) => {
  // cy.get("#bu_db").focus().clear().type(db);
  // cy.get("#bu_file").focus().clear().type(BU_FILE_NAME);
  // cy.get("#backup").click();
  // cy.contains("Backed up", { timeout: 60000 });
  await $('#bu_db').setValue(db);
  await $('#bu_file').setValue('test');
  await $('#backup').click();
  // comp: need to write a simple contains with auto wait as per cypress
  await $('#status').waitUntil(async function () {
    return (await this.getText()) === 'Backed up'
  }, {
    timeout: 5000,
    timeoutMsg: 'Failed to backup DB'
  });
});

Then("Backup the {string} db schema", (db) => {
  cy.get("#bu_db").focus().clear().type(db);
  cy.get("#bu_file").focus().clear().type(BU_FILE_NAME);
  cy.get("#opts").focus().clear().type("--routines --triggers --no-data");
  cy.get("#tables").focus().clear();
  cy.get("#backup").click();
  cy.contains("Backed up", { timeout: 60000 });
});

Then("Backup the {string} db schema copy", (db) => {
  cy.get("#bu_db").focus().clear().type(db);
  cy.get("#bu_file")
    .focus()
    .clear()
    .type(BU_FILE_NAME + "_schema");
  cy.get("#opts").focus().clear().type("--routines --triggers --no-data");
  cy.get("#tables").focus().clear();
  cy.get("#backup").click();
  cy.contains("Backed up", { timeout: 60000 });
});

Then("Backup the {string} db tables {string}", (db, tables) => {
  cy.get("#bu_db").focus().clear().type(db);
  cy.get("#bu_file").focus().clear().type(BU_FILE_NAME);
  cy.get("#opts").focus().clear();
  cy.get("#tables").focus().clear().type(tables);
  cy.get("#backup").click();
  cy.contains("Backed up", { timeout: 60000 });
});

Then("Restore to the test db", async () => {
  // cy.get("#rest_file").focus().clear().type(BU_FILE_NAME);
  // cy.get("#rest_db").focus().clear().type(TEST_DB); // should be set to test but belt and braces and CAREFUL since we login to the "nem" db to recover at times
  // cy.get("#restore").click();
  // cy.contains("Restored", { timeout: 120000 });
  await $('#rest_file').setValue('test');
  await $('#rest_db').setValue('test');
  await $('#restore').click();
  // comp: need to write a simple contains with auto wait as per cypress
  await $('#status').waitUntil(async function () {
    return (await this.getText()) === 'Restored'
  }, {
    timeout: 60000,
    timeoutMsg: 'Failed to restore DB'
  });
});

Then("Load historical data for {string}", (dateRange) => {
  cy.get("#py_params").focus().clear().type(dateRange);
  cy.get("#run_py").click();
  cy.contains("Loaded", { timeout: 150000 });
});

// not used now
Then("Patch test.sql", () => {
  cy.get("#py_params")
    .focus()
    .clear()
    .type(
      "sed -i 's/pybaseco/pybaseco_nem/g' /home2/pybaseco/public_html/dsql/test.sql"
    );
  cy.get("#shell_exec").click();
  cy.contains("Done", { timeout: 5000 });
});

