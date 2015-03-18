'use strict';

import THREE from 'three.js';
import * as colors from './colors';
import * as textures from './textures';


export function setup(app) {
  var host = app.addHost( {
    id: 'UUID 1',
    cpu: { model: 'Test CPU', count: 2 },
    memory: {total: 1234567890},
    operatingSystem: {name: 'OS'} } );

  host.addContainer( { id: 'uuid2', pid: '1' } );
  host.addContainer( { id: 'uuid3', pid: '2' } );
  host.addContainer( { id: 'uuid4', pid: '3' } );
  host.addContainer( { id: 'uuid5', pid: '4' } );
  //host.addContainer( { id: 'uuid6', pid: '5' } );
}
