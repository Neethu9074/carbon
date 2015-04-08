'use strict';

import React from 'react';
import logging from 'instalog';
import Map from '../src';

import rStats from './rStats';
import glStats from './rStats.extras';

const consoleAppender = new logging.ConsoleAppender();
logging.addAppender(consoleAppender);


React.render(
  <Map width="500" height="500"/>,
  document.body
);
