/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import initialiseSteps from 'in-init/initialiseSteps';

initialiseSteps([
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

  // Persistent backend connection
  'connection',

  // various components used in the UI
  'uiComponents',

  // accept terms and privacy settings
  'termsAndPrivacy',

  // if there is no agent deployed, force the onboarding dialog
  'instanaOnboarding',

  // This must be the second-last step: Rendering of the UI
  'productRendering',

  // This must be the last step: Collection of performance data.
  'appInitializedMeasurement'
]);
