/* global require:false */
/* eslint-disable no-console */

import 'core-js/stable';

import { build } from 'in-services/config';

if (!__DEV__) {
  console.log(
    '%cQuestions about Instana? Contact us via support@instana.com!',
    'font-size: 14px; color: #172429; font-weight: bold;'
  );
  console.log('Build information: %s', JSON.stringify(build));
}

const initializationSteps = [
  // polyfills
  'perfNowPolyfill',
  'mapPolyfill',

  // manipulation of built-in globals
  'defaultTimeout',

  // library configurations
  'eventLoop',
  'logging',

  // dev mode globals
  'dev',

  // plugin system
  'forge',

  // end-user monitoring for internal purposes
  'ineum',

  // Persistent backend connection
  'connection',

  // various components used in the UI
  'uiComponents',

  // accept terms and privacy settings
  'termsAndPrivacy',

  // Rendering of the UI. This must come last!
  'rendering'
];

nextStep(0);

function nextStep(index) {
  if (index >= initializationSteps.length) {
    // initialization process finished. yay!
    return;
  }

  // Using simple concatenation so that Webpack can properly analyze
  // this require statement for require.context creation.
  const mod = require('./init/' + initializationSteps[index] + '.js');
  if (!mod || !mod.init) {
    nextStep(index + 1);
    return;
  }

  const result = mod.init();
  if (!result || !result.once) {
    nextStep(index + 1);
    return;
  }

  result.once(() => nextStep(index + 1));
}
