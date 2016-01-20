// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
/* eslint-disable import-order/import-order */
import 'in-forge';

import * as reactRouter from 'react-router';
import React from 'react/addons';
import logging from 'instalog';

import * as tracking from 'in-services/tracking';
import * as persistentConnection from 'in-services/persistentConnection';
import * as subscriptonManager from 'in-services/subscription/subscriptionManager';
import * as timeOffsetStore from 'in-stores/timeOffset';

import UiTrackerLogAppender from './UiTrackerLogAppender';
import routes from './routes';
import i18n from './i18n';

// initiate time offset calculation. Module initialization has side effects.
import './i18n/momentOverwrites';

import './devtools/subscriptionInfoPrinter';
import './devtools/storeStates';

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
window.onerror = function f() {
  unhandledLogger.error.apply(unhandledLogger, arguments);

  // let the default error handler run as well
  return false;
};

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
}

// kick of the init process
persistentConnection.init();
subscriptonManager.init();
timeOffsetStore.init();

if (window.instana.user) {
  tracking.identify();
}

const router = reactRouter.create({
  routes,
  location: reactRouter.HashLocation
});
router.run((Root, state) => {
  React.render(<Root {...i18n} state={state} />, document.body);
});
