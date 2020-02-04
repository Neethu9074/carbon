import initialiseSteps from 'in-init/initialiseSteps';

initialiseSteps([
  // polyfills
  'coreJsPolyfills',
  'perfNowPolyfill',
  'mapPolyfill',

  // console concat and build information
  'consoleBuildInformation',

  // manipulation of built-in globals
  'defaultTimeout',

  // library configurations
  'eventLoop',
  'logging',

  // dev mode globals
  'dev',

  // end-user monitoring for internal purposes
  'ineum',

  // accept terms and privacy settings
  'waitingTermsAndPrivacy',

  // for anonymus tracking during the onboarding process
  'anonymousMixpanel',

  // Rendering of the UI. This must come last!
  'waitingRendering'
]);
