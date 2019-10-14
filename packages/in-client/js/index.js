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

  // if there is no agent deployed, force the onboarding dialog
  'instanaOnboarding',

  // Rendering of the UI. This must come last!
  'productRendering'
]);
