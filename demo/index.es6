'use strict';

import React from 'react';
import logging from 'instalog';
import Map from '../src';

import rStats from './rStats';
import glStats from './rStats.extras';

const consoleAppender = new logging.ConsoleAppender();
logging.addAppender(consoleAppender);

/*
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
*/

//setup statistics if dev demo
//if (__DEV__) {
  //createStats(uiApplication);
//}


React.render(
  <Map width="500" height="500"/>,
  document.body
);
