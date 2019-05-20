/* global require:false */
/* eslint-disable no-console */

if (!__DEV__) {
  console.log(
    '%c Questions about Instana? Contact us via support@instana.com!',
    'font-size: 14px; color: #172429; font-weight: bold;'
  );
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

  // Persistent backend connection
  'connection',

  // various components used in the UI
  'uiComponents',

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
