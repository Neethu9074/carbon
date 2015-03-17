'use strict';

import THREE from 'three.js';
import * as colors from './colors';
import * as textures from './textures';


export function setup(app) {
  app.addHost( { ID: 'UUID 1' } );
  app.addHost( { ID: 'UUID 2' } );
  app.addHost( { ID: 'UUID 3' } );
}
