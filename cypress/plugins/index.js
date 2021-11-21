/// <reference types="cypress" />

const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
const { lighthouse, prepareAudit } = require('cypress-audit');
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');



module.exports = (on, config) => {
  getCompareSnapshotsPlugin(on, config);

  on('before:run', async (details) => {
    console.log('override before:run');
    await beforeRunHook(details);
  });


  on('before:browser:launch', (browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
  });

  on('task', {
    lighthouse: lighthouse()
  });


  on('after:run', async () => {
    console.log('override after:run');
    await afterRunHook();
  });

}
