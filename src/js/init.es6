'use strict';

// Require the forge to add pluggables before everything else to ensure that
// the SDK is properly configured.
import 'instana-ui-forge';

import React from 'react';
import {run, HashLocation} from 'react-router';

import logging from 'instalog';
import {setThemeOnHtmlDocument} from 'instana-ui-services/theme';

import routes from './routes';
import i18n from './i18n';
import TrackerJsAppender from './TrackerJsAppender';

// the global console object does not exist in all browsers. A ConsoleAppender
// should thus only be added when it can actually log to a browser console.
if (logging.ConsoleAppender.isPossible()) {
  const consoleAppender = new logging.ConsoleAppender();
  consoleAppender.setActivePriority(11);
  logging.addAppender(consoleAppender);
}

if (window.trackJs) {
  const appender = new TrackerJsAppender();
  appender.setActivePriority(11);
  logging.addAppender(appender);
}

// add a theme css class on the HTML document to allow style overrides
setThemeOnHtmlDocument();

run(routes, HashLocation, (Root, state) => {
  React.render(<Root {...i18n} state={state} />, document.body);
});
