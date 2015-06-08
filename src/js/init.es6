'use strict';

// require the forge to add pluggables
import 'instana-ui-forge';

import React from 'react';
import logging from 'instalog';
import {setThemeOnHtmlDocument} from 'instana-ui-services/theme';

import App from './App';
import i18n from './i18n';

// the global console object does not exist in all browsers. A ConsoleAppender
// should thus only be added when it can actually log to a browser console.
if (logging.ConsoleAppender.isPossible()) {
  const consoleAppender = new logging.ConsoleAppender();
  consoleAppender.setActivePriority(11);
  logging.addAppender(consoleAppender);
}

// add a theme css class on the HTML document to allow style overrides
setThemeOnHtmlDocument();

React.render(
  <App {...i18n}/>,
  document.body
);
