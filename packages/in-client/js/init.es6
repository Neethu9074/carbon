// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
/* eslint-disable instana-import-order/instana-import-order */
/* global module: false, __HOT_RELOAD__: false */
import 'in-forge';

import { ConsoleAppender, addAppender } from 'instalog';
import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';

import { init as initHighlightedSuggestionStore } from 'in-components/SearchBar/stores/highlightedSuggestion';
import { init as initGlyphTexture } from 'in-map/singleMeshFactories/pluginIconsGlyphTexture';
import { init as initNotMonitoringPresenter } from 'in-services/notMonitoringDialogPresenter';
import { init as initLayouterStorage } from 'in-map/services/logical/logicalLayouterStorage';
import { init as initMessageStore } from 'in-components/MessageDialog/MessageDialogStores';
import { init as initDebuggingBackchannel } from 'in-services/debuggingBackchannel';
import { init as initUnhandledErrorHandling } from 'in-services/unhandledErrors';
import { setSetTimeoutFn, setClearTimeoutFn } from 'reactive-observables/timers';
import { init as initTimelineStore } from 'in-components/timeline/timelineStore';
import { isTwoZeroBetaPhase, twoZeroModeEnabled } from 'in-services/featureFlags';
import { init as initTwoZeroBetaPhaseQueryParam } from 'in-services/betaPhase';
import { init as initErrorBoundary } from 'in-components/ErrorBoundary/store';
import { init as initEventsInTimeframe } from 'in-stores/eventsInTimeframe';
import { init as initMaintenanceNoteStore } from 'in-stores/maintenance';
import { init as initBrowserIdentification } from 'in-services/browser';
import { init as initTimeOffsetStore } from 'in-stores/timeOffset';
import { init as initFaviconHandling } from 'in-services/favicon';
import { init as initConnection } from 'in-connection';
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
if (ConsoleAppender.isPossible()) {
  const consoleAppender = new ConsoleAppender();
  consoleAppender.setActivePriority(11);
  addAppender(consoleAppender);
}

if (!__DEV__) {
  const uiTrackerAppender = new UiTrackerLogAppender();
  uiTrackerAppender.setActivePriority(31);
  addAppender(uiTrackerAppender);
}

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
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
!twoZeroModeEnabled && initTimelineStore();
isTwoZeroBetaPhase && initTwoZeroBetaPhaseQueryParam();
initMessageStore();
initShortcuts();
initNotMonitoringPresenter();
initHighlightedSuggestionStore();
initUsageInfo();
initMaintenanceNoteStore();
initUnhandledErrorHandling();
initAutoFocus();
!twoZeroModeEnabled && initEvents();
!twoZeroModeEnabled && initEventsInTimeframe();
initFaviconHandling();
initErrorBoundary();
initDebuggingBackchannel();

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('main')
);

if (__HOT_RELOAD__ && module.hot) {
  module.hot.accept('in-client/js/App', () => {
    /* global require: false */
    const NextApp = require('in-client/js/App').default;
    ReactDOM.render(
      <Router history={history}>
        <NextApp />
      </Router>,
      document.getElementById('main')
    );
  });
}
