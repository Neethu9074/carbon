// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
/* eslint-disable import-order/import-order */
import 'in-forge';

import * as reactRouter from 'react-router';
import ReactDOM from 'react-dom';
import logging from 'instalog';
import React from 'react';

import * as subscriptonManager from 'in-services/subscription/subscriptionManager';
import * as messageStore from 'in-components/MessageDialog/MessageDialogStores';
import * as persistentConnection from 'in-services/persistentConnection';
import * as timeOffsetStore from 'in-stores/timeOffset';
import * as filteringStore from 'in-stores/filtering';
import * as tracking from 'in-services/tracking';

import UiTrackerLogAppender from './UiTrackerLogAppender';
import routes from './routes';
import i18n from './i18n';

// initiate time offset calculation. Module initialization has side effects.
import './i18n/momentOverwrites';

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
filteringStore.init();
messageStore.init();

if (window.instana.user) {
  tracking.identify();
}

const router = reactRouter.create({
  routes,
  location: reactRouter.HashLocation
});
const container = document.getElementById('main');
router.run((Root, state) => {
  ReactDOM.render(<Root {...i18n} state={state} />, container);
});
