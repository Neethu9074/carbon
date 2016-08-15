/* global require:false */

// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
/* eslint-disable instana-import-order/instana-import-order */
import 'in-forge';

import {Router, hashHistory} from 'react-router';
import ReactDOM from 'react-dom';
import logging from 'instalog';
import React from 'react';

import * as highlightedSuggestionStore from 'in-components/SearchBar/stores/highlightedSuggestion';
import * as layouterStorage from 'in-map/src/services/process/logicalLayouterStorage';
import * as tableViewVisibilityStore from 'in-components/tableView/stores/visibility';
import * as subscriptonManager from 'in-services/subscription/subscriptionManager';
import * as notMonitoringPresenter from 'in-services/notMonitoringDialogPresenter';
import * as messageStore from 'in-components/MessageDialog/MessageDialogStores';
import * as expandedIdsStore from 'in-components/tableView/stores/expandedIds';
import * as persistentConnection from 'in-services/persistentConnection';
import * as timelineStore from 'in-components/timeline/timelineStore';
import * as browserIdentification from 'in-services/browser';
import * as timeOffsetStore from 'in-stores/timeOffset';
import * as shortcuts from 'in-services/shortcuts';
import * as tracking from 'in-services/tracking';

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
window.addEventListener('error', (e) => {
  // violation of SOP - we cannot read the error…
  if (e.message === 'Script error.') {
    unhandledLogger.error('Unhandled error which we cannot read due to SOP');
  } else {
    unhandledLogger.error(`Unhandled error: ${e.message} at ${e.filename}:${e.lineno}`, e.error);
  }

  // let the default error handler run as well
  return false;
}, false);

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
  window.React.Perf = require('react-addons-perf');
}

// kick of the init process
layouterStorage.init();
browserIdentification.init();
persistentConnection.init();
subscriptonManager.init();
timeOffsetStore.init();
timelineStore.init();
messageStore.init();
shortcuts.init();
tracking.init();
notMonitoringPresenter.init();
tableViewVisibilityStore.init();
expandedIdsStore.init();
highlightedSuggestionStore.init();

ReactDOM.render((
  <Router history={hashHistory}>
    {routes}
  </Router>
), document.getElementById('main'));
