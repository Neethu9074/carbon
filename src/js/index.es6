'use strict';

// require the forge to add pluggables
import 'instana-ui-forge';

import React from 'react';
import logging from 'instalog';
import {setThemeOnHtmlDocument} from 'instana-ui-services/theme';

import App from './App';
import i18n from './i18n';
import * as airshow from './airshow';

if (logging.ConsoleAppender.isPossible()) {
  const consoleAppender = new logging.ConsoleAppender();
  // during development we want to see all log messages
  consoleAppender.setActivePriority(11);
  logging.addAppender(consoleAppender);
}

setThemeOnHtmlDocument();

React.render(
  <App {...i18n}/>,
  document.body
);

if (window.location.href.indexOf('airshow') !== -1) {
  airshow.start();
}
