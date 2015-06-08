'use strict';

import THREE from 'three';

import TouchController from './touchCameraController';


export default class MouseControl extends TouchController {

  constructor({scene}) {
    super({scene});

    // Wheel event is new (IE10+, Chrome 31+, FF 17+, Safari 7), but produces
    // a consistent range of scroll events.
    scene.parent.addEventListener('wheel', this.onWheel.bind(this));
  }

  onWheel(e) {
    e.preventDefault();

    // Because we listen to onwheel, the e.deltaY "should be" in a range of
    // +/- 0 .. 200, but sometimes is much larger due to "buffering" of scroll
    // events. Our map prefers values in the range of
    // +/- 0 .. 30. Because we cannot prevent buffering (browser seems not to)
    // react to user scroll, we at least prevent zooming way to much by capping
    // the value.

    // Touchy devices tend to send more frequent smaller scrolls, while "old"
    // mice send stable large ticks.

    // scale down
    let zoom = (e.deltaY / 6) | 0;
    // clamp to -30 .. 30
    if (zoom < -30) {
      zoom = -30;
    } else if (zoom > 30) {
      zoom = 30;
    }
    this.zoom(zoom);
  }
}
