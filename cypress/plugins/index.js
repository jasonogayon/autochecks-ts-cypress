/// <reference types="cypress" />

const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
const { lighthouse, prepareAudit } = require('cypress-audit');


module.exports = (on, config) => {

  on('before:run', async (details) => {
    console.log('override before:run');
    await beforeRunHook(details);
  });


  on('before:browser:launch', (browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
        if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu');
      return launchOptions;
    }
  });

  on('task', {
    lighthouse: lighthouse()
  });


  on('after:run', async () => {
    console.log('override after:run');
    await afterRunHook();
  });

}
