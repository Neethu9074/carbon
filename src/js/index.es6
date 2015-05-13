'use strict';

// require the forge to add pluggables
import 'instana-ui-forge';

import React from 'react';
import logging from 'instalog';

import App from './App';

const consoleAppender = new logging.ConsoleAppender();

// during development we want to see all log messages
if (__DEV__) {
  consoleAppender.setActivePriority(0);
} else {
  consoleAppender.setActivePriority(10);
}

logging.addAppender(consoleAppender);

React.render(
  <App />,
  document.body
);
