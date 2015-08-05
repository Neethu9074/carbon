'use strict';

import * as ro from 'reactive-observables';

import TouchController from './TouchCameraController_temp';
import {cursorPosition} from '../stores/mapStore';


export default class MouseControl extends TouchController {

  constructor({scene}) {
    super({scene});
    this.lastMousePosition = {x: 0, y: 0};

    const canvas = scene.renderer.domElement;
    canvas.onmousemove = (e) => {
      e.preventDefault();

      const roundedX = e.clientX | 0;
      const roundedY = e.clientY | 0;
      if (this.lastMousePosition.x !== roundedX ||
          this.lastMousePosition.y !== roundedY) {
        this.lastMousePosition.x = roundedX;
        this.lastMousePosition.y = roundedY;
        cursorPosition.emit(this.lastMousePosition);
        this.handleRayCasting();
      }
    };

    // Wheel event is new (IE10+, Chrome 31+, FF 17+, Safari 7), but produces
    // a consistent range of scroll events.
    ro.on(canvas, 'wheel')
      .scan((aggregate, e) => {
        e.preventDefault();
        aggregate.deltaY += e.deltaY;
        return aggregate;
      }, {
        deltaY: 0
      })
      .throttle(50)
      .subscribe((aggregate) => {
        const deltaY = aggregate.deltaY;
        aggregate.deltaY = 0;

        // Because we listen to onwheel, the e.deltaY "should be" in a range of
        // +/- 0 .. 200, but sometimes is much larger due to "buffering" of scroll
        // events. Our map prefers values in the range of
        // +/- 0 .. 50. Because we cannot prevent buffering (browser seems not to)
        // react to user scroll, we at least prevent zooming way to much by capping
        // the value.

        // Touchy devices tend to send more frequent smaller scrolls, while "old"
        // mice send stable large ticks.

        // scale down
        let zoom = (deltaY / 4) | 0;
        // clamp to -50 .. 50
        if (zoom < -50) {
          zoom = -50;
        } else if (zoom > 50) {
          zoom = 50;
        }
        this.zoom(zoom);
      });
  }
}
