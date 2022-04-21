import { Given, When, Then } from '@wdio/cucumber-framework';

Given("I go to the Unearthed website", async () => {
  // comp: need enviro variables
  await browser.url(`https://www.abc.net.au/triplejunearthed/`);
})

When("I click the {string} More link 0", async (page) => {
  const more = await $(`[href=${page}][data-component="MoreLink"]`)
  more.scrollIntoView(); // to avoid cookie policy region getting in the way
  more.click()
});

When("I click the {string} More link", async (page) => {
  // the HeadingBar comp contains the span of text in one div and then the More button in the sibling div
  let more1 = await $(`h1=${page}`)
  let more2 = await more1.parentElement().nextElement();
  let more3 = await more2.$(`[data-component="MoreLink"]`)
  more3.scrollIntoView(); // to avoid cookie policy region getting in the way
  more3.click()
});

Then("I am on the {string} tab", async (page) => {
  page = page.toLowerCase();
  await expect(browser).toHaveUrl(`https://www.abc.net.au/triplejunearthed/${page}/`)
});
