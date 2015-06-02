'use strict';

// require the forge to add pluggables
import 'instana-ui-forge';

import React from 'react';
import logging from 'instalog';
import {setThemeOnHtmlDocument} from 'instana-ui-services/theme';

import App from './App';
import * as airshow from './airshow';

if (logging.ConsoleAppender.isPossible()) {
  const consoleAppender = new logging.ConsoleAppender();
  // during development we want to see all log messages
  consoleAppender.setActivePriority(0);
  logging.addAppender(consoleAppender);
}

setThemeOnHtmlDocument();

React.render(
  <App />,
  document.body
);

if (window.location.href.indexOf('airshow') !== -1) {
  airshow.start();
}
