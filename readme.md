# Some notes on moving from Cypress to Webdriverio
The browser / web app is a my personal Ride Tracker project which runs in the browser with a MySQL backend with a PHP bridge.

A recording of the Cypress tests is at https://youtu.be/GD_KnKP9urY

Moving from Cypress to Webdriverio was done as a project to identify some of the major differences.

The major advantage of moving to webdriverio is that it supports driving  Safari as well as mobile (Android and iOS browsers) as well as driving mobile apps via Appium.

A known difference is that Cypress "sits inside" the web page whereas webdriverio having a Selenium heritage drives the web page from outside. Cypress is therefore limited to driving only one page at a time and cannot control two web pages or even tabs at the same time.

These notes take the form of a journal.

## Webdriverio with Page Objects
23 March 2022 

Idea is to start from (and hopefully not have to alter) the two feature files that already exist in the cypress project.  And replace the cypress specific driver code with webdriverio driver code.

Copied the VSCode cypress project and installed webdriverio following the instructions at https://webdriver.io/docs/gettingstarted/. Ran init (messed up and chose non-cucumber and page objects).  Worked fine.  

But I'm still in two minds about using page objects - I can see some benefits but using a good naming convention avoids this additional code which takes time to write and maintain.  And even though it hides actual ids/names it then requires the reader of the code to lookup the page object functions to determine the actual web element.

For example this is the login page object file:

```
const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputDatabase () {
        return $('#db');
    }

    get inputUsername () {
        return $('#user');
    }

    get inputPassword () {
        return $('#password');
    }

    get btnSubmit () {
        return $('button[type="submit"]');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login (username, password) {
        await this.inputDatabase.setValue("test");  // don't mess with production !!!
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open('rides/');
    }
}

module.exports = new LoginPage();
```

And here is a call to the `login` method from the specs.js file

```
describe('Ride Tracker application', () => {
    it('I can login with valid credentials', async () => {
        await LoginPage.open();
        await LoginPage.login('richard', 'xxxxxx');  // todo: use env vars
        // check we are now on the List page (there is no change to the URL!)
        await expect(ListPage.lblLastWeek).toBeExisting();
    });
});
```

Notice the need to use async/await... more on this later

## Webdriverio without page objects but with cucumber framework
Recreated the webdriverio project using cucumber (so that I can reuse the feature files, as planned).  The feature file is the same for cypress and webdriverio:

```
  Scenario: Restore to test db
    Given I login as a developer
    Then  go to "Database"
    Then  Backup the "rides2" db
    Then  Restore to the test db
    And   I logout
```

Cypress js step definition for the first (the Given) step:

```
Given("I login as a developer", () => {
  cy.visit(Cypress.env("PROD_URL"));
  cy.get("#db").focus().clear().type(Cypress.env("DB_NAME"));
  cy.get("#user").focus().clear().type(Cypress.env("DEV_NAME"));
  cy.get("#password").focus().clear().type(Cypress.env("DEV_PASSWORD"));
  cy.get("#login").click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
});
```
And the equivalent using webdriverio:
```
Given("I login as a developer", async () => {
  await browser.url(`https://artspace7.com.au/pybase/plus/`);

  await $('#db').setValue("test");  // don't mess with production !!!
  await $('#user').setValue('richard'); // todo use process.env
  await $('#password').setValue('xxxxxx');
  await $('#login').click();
});
```
Again, notice the need to use async and await

Also, cypress encourages the use of the cypress.env.json file whereas webdriverio leaves you to use the standard process.env facility (which I have not done in the interest of getting something going...)

Webdriverio has different but equivalent functions (no problem; eg `cy.visit()` becomes `browser.url()`).  Webdriverio has a powerful means of selecting elements on the web page using a JQuery like syntax using `$()` to get a single/the first element and `$$()` to get all elements. The selector support in webdriverio is arguably more powerful though cypress has a `.contains()` method in addition to a `.get()` method.

The biggest loss moving from cypress to webdriverio is the loss of the cypress test runner.  But there is a REPL which can really help with debugging.

The speed of webdriverio code is impressive.

*Todo: Put above points into a table*

## Going further with webdriverio
24 March 2022

import has to be require. Why JS experts?

Tests run very quickly (headed). Might even be quicker headlessly.

How do I wait for x seconds?  Though I don't seem to need to explicitly add waits so far. ANd how do I wait for some text to appear. In cypress I'd use a `cy.contains()` :
```
cy.contains("Backed up", { timeout: 60000 });
```

In webdriverio I need to do the following (will need to gather useful functions into a utils.js library):

```
  await $('#status').waitUntil(async function () {
    return (await this.getText()) === 'Backed up'
  }, {
    timeout: 60000,
    timeoutMsg: 'Failed to backup DB'
  });
```

### Downloading/saving/reading/writing files
Cypress provides a download folder that overrides the browser's download location whereas with wdio you  have to contend with the browser download location. Cypress also removes all files from the special download folder at the start of a test run ensuring you do not get false positives from having files from a previous test run. wdio doco suggests using a Prepare() function to clean the download folder.

In addition, the download file name will remain a temporary file name if the wdio test script finishes too quickly (and they run fast).

Reading/writing a file in cypress is done via cy.readFile() and cy.writeFile(). wdio suggests using the 'fs' library and readFileSync() and writeFileSync() functions.

## LambdaTest Trial account
Sat, 26 March 2022

Created a trial account on LambdaTest and successfully ran the existing cypress tests on Chrome and Firefox under Max Catalina :)

Attempting the same with Safari fails to start -- appears to confirm that cypress cannot drive Safari :( which is a showstopper for most commercial public facing web sites. 
Later on got first test (401) rewritten using webdriverio running on Lambdatest.

## Lambdatest and webdriverio
Mon, 28 March 2022

Difficult following lambdatest instructions to get webdriverio tests setup -- cypress setup was so clear and easy.  Backed out and redid carefully. Essentials are to have user and key and servies=['lambdatest'] and to install wdio-lambdatest-service for development. No tunnel (that is for their servers to talk back to the local tests).

Can now run cy and wdio tests locally and cy tests on Windows Chrome and Mac Chrome on Lambdatest. And some wdio tests on Windows Chrome and Mac Safari (again on Lambdatest). :)

Biggest issues are with being able to download files and control the browser download location under wdio. ChromeOpts? Look into cypress source?

## Download issues...
Tue, 29 March 2022

`createElement` has to be done very differently on wdio as opposed to cypress. (Cypress is running inside the browser and has full access to the DOM; wdio is "outside" the browser). wdio requires using `browser.execute()`

So this cypress function to download a file by creating an invisible link
```
function downloadCSV(csv, filename) {
  const csvFile = new Blob([csv], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}
```
becomes the following when rewritten to use webdriverio:
```
async function downloadCSV(csv, filename) {
  await browser.execute(
    async function (csv, filename) {
      const csvFile = new Blob([csv], { type: "text/csv" });
      const downloadLink = document.createElement("a");
      downloadLink.download = filename;
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      await downloadLink.click();
    }, csv, filename
  );
}
```

Also, need to import/require `chaiExpect` in wdio (rather than `chai` in cypress) to use some expect functionality (eg `expect(actualLine).to.match(new RegExp(expectedLine));`)

Discovered I need to set an option to allow Chrome to download multiple files else a prompt interrupts testing on a Mac.

Played with the wdio REPL:

    npx wdio repl chrome

Very useful for debugging.

## Download issues...resolved
Wed, 30 March 2022

Idea: avoid downloading files by comparing the string that was being saved to a file (to be compared with the expected result by doing a file to file comparison), by directly comparing the string with the expected file.  This requires restructuring and rewriting the download/compare functions.

## No more download files
Thurs, 31 March 2022

Implemented above -- success -- now have all tests working (and no issues with downloading files/download file location).

Getting one fail on Mac/Safari when we save all cell contents from a table to a string -- a space is missing. Windows and Mac/Chrome passes. Bug?

## Headless and log level options
Fri, 1 April 2022

added --headless option and changed log level to "error' to reduce noise

## Another idea
Sat, 2 April

Idea: notice it is slow to have the test script get all cells/rows of a table on Lambdatest (no slowdown noticeable locally).  Use getPartialDOM function to get whole table in one go and compare to expected... for a future day...

## Browserstack trial
Sun, 3 April

My Lambdatest account has limited time left. Experimented with running the tests on Saucelabs...gave up! Instructions not clear.

Browserstack trial account next - easy! Again set user and key and service and install `@wdio/browserstack-service`. Make sure tunnel is false!

Tests on Windows/Chrome, Mac/Safari, Samsung Galaxy (Android) and iPhone 12 (iOS) all run successfully.  And, have the same space difference running on Mac/Safari as seen on Lambdatest.  At least consistent.

## Tags
Mon, 4 April 2022

Added @skip, @skip_if_local, @skip_if_not_local to tag expressions so that can have different tests locally to those on Lamdatest/Browserstack (locally can download files; remotely we don't want to do this).

Read about Serenity/JS -- builds on Webdriverio.  To be investigated.

## Todo / Future

1. Use environment vars (process.env.XXXX)
2. Use typescript -- should have started that way...

