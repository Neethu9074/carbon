// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
/*eslint-disable import-order/import-order*/
import 'in-forge';

import {run, HashLocation} from 'react-router';
import React from 'react/addons';
import logging from 'instalog';

import * as tracking from 'in-services/tracking';
import 'in-services/time';

import UiTrackerLogAppender from './UiTrackerLogAppender';
import routes from './routes';
import i18n from './i18n';

// initiate time offset calculation. Module initialization has side effects.
import './i18n/momentOverwrites';

import './devtools/subscriptionInfoPrinter';
import './devtools/timeOffsetProvider';
import './devtools/checkForWiredComponentsThatAreNotExisting';

// the global console object does not exist in all browsers. A ConsoleAppender
// should thus only be added when it can actually log to a browser console.
if (logging.ConsoleAppender.isPossible()) {
  const consoleAppender = new logging.ConsoleAppender();
  consoleAppender.setActivePriority(11);
  logging.addAppender(consoleAppender);
}

if (!__DEV__) {
  const uiTrackerAppender = new UiTrackerLogAppender();
  uiTrackerAppender.setActivePriority(31);
  logging.addAppender(uiTrackerAppender);
}

const unhandledLogger = logging.createLogger('in-client.unhandled');
window.onerror = function() {
  unhandledLogger.error.apply(unhandledLogger, arguments);

  // let the default error handler run as well
  return false;
};

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
}

// intall the hubspot analytics code for demo and customer environments.
// Exclude it locally and on instana tenant units
if (window.location.href.indexOf('instana.instana.io') === -1) {
  // value from the generated snippet
  const cacheBreakingTime = 300000;
  const cacheBreakingPath = Math.ceil(new Date() / cacheBreakingTime) * cacheBreakingTime;
  const script = document.createElement('script');
  script.id = 'hs-analytics';
  script.src = '//js.hs-analytics.net/analytics/' + cacheBreakingPath + '/719302.js';
  document.head.appendChild(script);
}

if (window.instana.user) {
  tracking.identify();
}

run(routes, HashLocation, (Root, state) => {
  React.render(<Root {...i18n} state={state} />, document.body);
});
