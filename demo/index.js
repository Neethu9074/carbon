'use strict';

import {load} from '../src/javascript/ui_prototype/resources';
/*eslint-disable max-len */
import DataListenerManager from '../src/javascript/instana_data/dataListenerManager';
/*eslint-enable max-len */
import App from '../src/javascript/ui_prototype/app';
import rStats from './rStats';
import glStats from './rStats.extras';
import {setup} from '../src/javascript/ui_prototype/testSetup';
import logging from 'instalog';

import React from 'react';
import Map from '../src';

//console.log(logging);
const appender = new logging.ConsoleAppender();
logging.addAppender(appender);

const logger = logging.createLogger('index.js');
const liveData = false;

//first load all resources
logger.info('Loading resources...');
load(() => { //on finished
  const canvas = document.getElementById('WebGL');

  logger.info('Initializing application');

  //start up the UI when all resources are loaded
  const uiApplication = new App(canvas);

  //setup statistics if dev demo
  if (__DEV__) {
    createStats(uiApplication);
  }


  if(liveData) {
    //live data each 2000 ms
    const dataManager = new DataListenerManager(uiApplication, 1000);
    logger.info('get live data via', dataManager);
  } else {
    //test setup
    setup(uiApplication);
  }
  logger.info('Finished initialization');
});

function createStats(app) {
  let glS = new glStats.GlStats(app.emitter);
  let tS = new glStats.ThreeStats(app.webGLRenderer);
  let rS = new rStats.RStats(app.emitter, {
    values: {
      frame: {
        caption: 'Total frame time (ms)',
        over: 16
      },
      fps: {
        caption: 'Framerate (FPS)',
        below: 30
      },
      calls: {
        caption: 'Calls (three.js)',
        over: 3000
      },
      raf: {
        caption: 'Time since last rAF (ms)'
      },
      rstats: {
        caption: 'rStats update (ms)'
      }
    },
    groups: [{
      caption: 'Framerate',
      values: ['fps', 'raf']
    }, {
      caption: 'Frame Budget',
      values: ['frame', 'texture', 'setup', 'render']
    }],
    plugins: [
      tS,
      glS
    ]
  });
  logger.info('created statisitcs', rS);
}

/*
React.render(
  <Map width="500" height="500"/>,
  document.body
);
*/
