'use strict';

import * as ro from 'reactive-observables';

import TouchController from './TouchCameraController_temp';
import eventBus from 'instana-ui-services/eventbus';


export default class MouseControl extends TouchController {

  constructor({scene}) {
    super({scene});
    const canvas = scene.parent;

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

    canvas.onmousemove = (e) => {
      eventBus.emit('onCursorMove', {x: e.clientX, y: e.clientY});
      this.onMouseMove(e);
    };
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

    this.scene.handleHoveredConnetions(this.raycaster);

    this.cursor.x = x;
    this.cursor.y = y;
  }
}
