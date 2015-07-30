'use strict';

// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
import 'in-forge';

import React from 'react/addons';
import {run, HashLocation} from 'react-router';

import logging from 'instalog';
import {setThemeOnHtmlDocument} from 'in-services/theme';

import routes from './routes';
import i18n from './i18n';
import UiBackendLogAppender from './UiBackendLogAppender';

// initiate time offset calculation. Module initialization has side effects.
import 'in-services/time';
import './i18n/momentOverwrites';

import './devtools/subscriptionInfoPrinter';
import './devtools/timeOffsetProvider';

// the global console object does not exist in all browsers. A ConsoleAppender
// should thus only be added when it can actually log to a browser console.
if (logging.ConsoleAppender.isPossible()) {
  const consoleAppender = new logging.ConsoleAppender();
  consoleAppender.setActivePriority(11);
  logging.addAppender(consoleAppender);
}

const uiBackendAppender = new UiBackendLogAppender();
uiBackendAppender.setActivePriority(30);
logging.addAppender(uiBackendAppender);

const unhandledLogger = logging.createLogger('in-client.unhandled');
window.onerror = function() {
  unhandledLogger.error.apply(unhandledLogger, arguments);

  // let the default error handler run as well
  return false;
};

// add a theme css class on the HTML document to allow style overrides
setThemeOnHtmlDocument();

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
}

run(routes, HashLocation, (Root, state) => {
  React.render(<Root {...i18n} state={state} />, document.body);
});
