'use strict';

import React from 'react';
import logging from 'instalog';
import Map from '../../src';

export default function init() {
  const consoleAppender = new logging.ConsoleAppender();
  logging.addAppender(consoleAppender);

  React.render(
    <Map width="500" height="500"/>,
    document.body
  );
}
