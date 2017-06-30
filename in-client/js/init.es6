/* global require:false */

// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
/* eslint-disable instana-import-order/instana-import-order */
import 'in-forge';

import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import logging from 'instalog';
import React from 'react';

import { setSetTimeoutFn, setClearTimeoutFn } from 'reactive-observables/lib/timers';
import { init as initHighlightedSuggestionStore } from 'in-components/SearchBar/stores/highlightedSuggestion';
import { init as initGlyphTexture } from 'in-map/singleMeshFactories/pluginIconsGlyphTexture';
import { init as initNotMonitoringPresenter } from 'in-services/notMonitoringDialogPresenter';
import { init as initLayouterStorage } from 'in-map/services/logical/logicalLayouterStorage';
import { init as initMessageStore } from 'in-components/MessageDialog/MessageDialogStores';
import { init as initUnhandledErrorHandling } from 'in-services/unhandledErrors';
import { init as initTimelineStore } from 'in-components/timeline/timelineStore';
import { init as initEventsInTimeframe } from 'in-stores/eventsInTimeframe';
import { init as initMaintenanceNoteStore } from 'in-stores/maintenance';
import { init as initBrowserIdentification } from 'in-services/browser';
import { init as initTimeOffsetStore } from 'in-stores/timeOffset';
import { init as initFaviconHandling } from 'in-services/favicon';
import { init as initConnection } from 'in-services/connection';
import history from 'in-stores/navigation/history';

// this is never unused. delete and die
import { setTimeout, clearTimeout } from 'in-services/chronos';

import { init as initAutoFocus } from 'in-map/services/focus';
import { init as initShortcuts } from 'in-services/shortcuts';
import { init as initUsageInfo } from 'in-stores/usageInfo';
import { init as initEvents } from 'in-stores/events';

import UiTrackerLogAppender from './UiTrackerLogAppender';
import App from 'in-client/js/App';

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

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
  window.React.Perf = require('react-addons-perf');
}

// configure reactive-observables to use chronos by default
setSetTimeoutFn(setTimeout);
setClearTimeoutFn(clearTimeout);

// kick of the init process
initConnection();
initGlyphTexture();
initLayouterStorage();
initBrowserIdentification();
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
initEvents();
initEventsInTimeframe();
initFaviconHandling();

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('main')
);
