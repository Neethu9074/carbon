/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import initialiseSteps from 'in-init/initialiseSteps';

initialiseSteps([
  // Initialize the globalization options
  'globalization',

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

  // Localization/Globalization
  'i18n',

  // accept terms and privacy settings
  'waitingTermsAndPrivacy',

  // for anonymus tracking during the onboarding process
  'anonymousMixpanel',

  // This must be the second-last step: Rendering of the UI
  'waitingRendering',

  // This must be the last step: Collection of performance data.
  'appInitializedMeasurement'
]);
