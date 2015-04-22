'use strict';

import THREE from 'three.js';
import colors from './colors';
import * as textures from './textures';
import Connection from './sceneObjects/cubeConnection';

import logging from 'instalog';
const logger = logging.createLogger('testSetup.js');

export function setup(app) {

  const max = 3;
  let step = 1;
  let counter = 0;
  setInterval(function() {
    if(counter >= step){
      return;
    }

    app.addRandomHost();
    counter++;
  }, 10);

  setInterval(function() {
    if(step < max) {
      step += 1;
      logger.debug(counter, 'cubes created');
    }
  }, 200);
}
