'use strict';

import THREE from 'three.js';
import * as colors from './colors';
import * as textures from './textures';


export function setup(app) {
  let host = app.addRandomHost();

  host.addContainer( { id: 'uuid1', pid: '1' } );
  host.addContainer( { id: 'uuid2', pid: '2' } );
  host.addContainer( { id: 'uuid3', pid: '3' } );
  host.addContainer( { id: 'uuid4', pid: '4' } );
  //host.addContainer( { id: 'uuid6', pid: '5' } );

return;

  var max = 5;
  var step = 1;
  var counter = 0;
  setInterval(function() {
    if(counter >= step) return;

    app.addRandomHost();
    counter++;
    //console.log(counter, app.layouter.getFree().length)
  }, 10);

    setInterval(function() {
      if(step <= max) {
        step += 1;
      }
    }, 100);

}
