'use strict';

import THREE from 'three';

import TouchController from './touchCameraController';
import eventBus from 'instana-ui-services/eventbus';


export default class MouseControl extends TouchController {

  constructor({scene}) {
    super({scene});
      const canvas = scene.parent;

    // Wheel event is new (IE10+, Chrome 31+, FF 17+, Safari 7), but produces
    // a consistent range of scroll events.
    canvas.addEventListener('wheel', this.onWheel.bind(this));

    canvas.onmousemove = (e) => {
      eventBus.emit('onCursorMove', {x: e.clientX, y: e.clientY});
      this.onMouseMove(e);
    };
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

  onMouseMove(e) {
    e.preventDefault();

    const x = this.cursor.x;
    const y = this.cursor.y;
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;

    const hitten = this.hittenObject;
    this.getObjectOnCursor();

    //if there is a hitten object
    if(this.hittenObject) {
      //if this is a new hitten object
      if(hitten !== this.hittenObject) {
        this.hittenObject.parentSceneObject.onHighlight(true);
        //if the new differs from the old and the old is valid
        if(hitten) {
          hitten.parentSceneObject.onHighlight(false);
        }
      }
      //if there is actually not hitten but it was last frame
    } else if(!this.hittenObject && hitten) {
      hitten.parentSceneObject.onHighlight(false);
    }

    this.cursor.x = x;
    this.cursor.y = y;
  }
}
