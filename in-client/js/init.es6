// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
/* eslint-disable instana-import-order/instana-import-order */
import 'in-forge';

import {Router, hashHistory} from 'react-router';
import ReactDOM from 'react-dom';
import logging from 'instalog';
import React from 'react';

import * as tableViewVisibilityStore from 'in-components/tableView/stores/visibility';
import * as subscriptonManager from 'in-services/subscription/subscriptionManager';
import * as notMonitoringPresenter from 'in-services/notMonitoringDialogPresenter';
import * as expandedIdsStore from 'in-components/tableView/stores/expandedIds';
import * as messageStore from 'in-components/MessageDialog/MessageDialogStores';
import * as persistentConnection from 'in-services/persistentConnection';
import * as timelineStore from 'in-components/timeline/timelineStore';
import * as browserIdentification from 'in-services/browser';
import * as timeOffsetStore from 'in-stores/timeOffset';
import * as filteringStore from 'in-stores/filtering';
import * as tracking from 'in-services/tracking';
import * as showrcuts from 'in-stores/shortcuts';

import UiTrackerLogAppender from './UiTrackerLogAppender';
import routes from './routes';

import './devtools/storeStates';
import './devtools/subscriptions';

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
browserIdentification.init();
persistentConnection.init();
subscriptonManager.init();
timeOffsetStore.init();
filteringStore.init();
timelineStore.init();
messageStore.init();
showrcuts.init();
tracking.init();
notMonitoringPresenter.init();
tableViewVisibilityStore.init();
expandedIdsStore.init();

ReactDOM.render((
  <Router history={hashHistory}>
    {routes}
  </Router>
), document.getElementById('main'));
