/* global require:false */

// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
/* eslint-disable instana-import-order/instana-import-order */
import 'in-forge';

import {Router, hashHistory} from 'react-router';
import ReactDOM from 'react-dom';
import logging from 'instalog';
import React from 'react';

import {init as initHighlightedSuggestionStore} from 'in-components/SearchBar/stores/highlightedSuggestion';
import {init as initGlyphTexture} from 'in-map/singleMeshFactories/pluginIconsGlyphTexture';
import {init as initSubscriptonManager} from 'in-services/subscription/subscriptionManager';
import {init as initNotMonitoringPresenter} from 'in-services/notMonitoringDialogPresenter';
import {init as initLayouterStorage} from 'in-map/services/logical/logicalLayouterStorage';
import {init as initMessageStore} from 'in-components/MessageDialog/MessageDialogStores';
import {init as initPersistentConnection} from 'in-services/persistentConnection';
import {init as initUnhandledErrorHandling} from 'in-services/unhandledErrors';
import {init as initTimelineStore} from 'in-components/timeline/timelineStore';
import {init as initMaintenanceNoteStore} from 'in-stores/maintenance';
import {init as initBrowserIdentification} from 'in-services/browser';
import {init as initTimeOffsetStore} from 'in-stores/timeOffset';
import {init as initFaviconHandling} from 'in-services/favicon';
import {init as initAutoFocus} from 'in-map/services/focus';
import {init as initShortcuts} from 'in-services/shortcuts';
import {init as initUsageInfo} from 'in-stores/usageInfo';

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

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
  window.React.Perf = require('react-addons-perf');
}

// kick of the init process
initGlyphTexture();
initLayouterStorage();
initBrowserIdentification();
initPersistentConnection();
initSubscriptonManager();
initTimeOffsetStore();
initTimelineStore();
initMessageStore();
initShortcuts();
initNotMonitoringPresenter();
initHighlightedSuggestionStore();
initUsageInfo();
initMaintenanceNoteStore();
initUnhandledErrorHandling();
initAutoFocus();
initFaviconHandling();

ReactDOM.render((
  <Router history={hashHistory}>
    {routes}
  </Router>
), document.getElementById('main'));
