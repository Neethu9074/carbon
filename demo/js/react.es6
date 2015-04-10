'use strict';

import React from 'react';
import logging from 'instalog';
import Map from '../../src';



export default function init() {
  const consoleAppender = new logging.ConsoleAppender();
  logging.addAppender(consoleAppender);

  React.render(
    <Map onClick={onClick}/>,
    document.body
  );

  function onClick () {
  }
}
