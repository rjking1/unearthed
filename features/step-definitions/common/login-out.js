
// import { Given, Then } from "cypress-cucumber-preprocessor/steps";
const { Given, When, Then } = require('@wdio/cucumber-framework');

// comp: need async and await in many places

Given("I login as a developer", async () => {

  // cy.visit(Cypress.env("PROD_URL"));
  await browser.url(`https://artspace7.com.au/pybase/plus/`);

  // cy.get("#db").focus().clear().type(Cypress.env("DB_NAME"));
  // cy.get("#user").focus().clear().type(Cypress.env("DEV_NAME"));
  // cy.get("#password").focus().clear().type(Cypress.env("DEV_PASSWORD"));
  // cy.get("#login").click();
  // // eslint-disable-next-line cypress/no-unnecessary-waiting
  // cy.wait(1000);

  // comp: need enviro variables

  await $('#db').setValue("test");  // don't mess with production !!!
  await $('#user').setValue('richard');
  await $('#password').setValue('viking');
  await $('#login').click();
});

// Given("I login as an admin", () => {
//   cy.visit(Cypress.env("PROD_URL"));
//   cy.get("#db").focus().clear().type(Cypress.env("DB_NAME"));
//   cy.get("#user").focus().clear().type(Cypress.env("ADMIN_NAME"));
//   cy.get("#password").focus().clear().type(Cypress.env("ADMIN_PASSWORD"));
//   cy.get("#login").click();
//   // eslint-disable-next-line cypress/no-unnecessary-waiting
//   cy.wait(1000);
// });

Then("I logout", async () => {
  // cy.visit(Cypress.env("PROD_URL"));
  await browser.pause(100)
});
