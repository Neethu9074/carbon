'use strict';

import THREE from 'three.js';
import * as colors from './colors';
import * as textures from './textures';
import Connection from './sceneObjects/cubeConnection';

import logging from 'instalog';
const logger = logging.createLogger('testSetup.js');

export function setup(app) {

  const tempConnections = [];

  let host = app.addRandomHost();
  let hostB = app.addRandomHost();
  let hostC = app.addRandomHost();

  const a = new Connection(host, hostB);
  const b = new Connection(hostB, hostC, true);
  tempConnections.push(a);
  tempConnections.push(b);

  host.addContainer( { id: 'uuid1', pid: '1' } );
  host.addContainer( { id: 'uuid2', pid: '2' } );
  host.addContainer( { id: 'uuid3', pid: '3' } );
  host.addContainer( { id: 'uuid4', pid: '4' } );


  const max = 2;
  let step = 1;
  let counter = 0;
  setInterval(function() {
    if(counter >= step){
      return;
    }

    app.addRandomHost();
    counter++;
    logger.debug(counter, 'cubes created');
  }, 10);

  setInterval(function() {
    if(step <= max) {
      step += 1;
    }
  }, 50);
}
