import React from 'react';
import logging from 'instalog';

import App from './App';

const consoleAppender = new logging.ConsoleAppender();
logging.addAppender(consoleAppender);

React.render(
  <App />,
  document.body
);
