import * as ro from 'reactive-observables';

import {getIn} from 'in-services/settings';
import {theme} from 'in-services/theme';

import TouchController from './TouchCameraController_temp';
import {cursorPosition} from '../mapStores';


export default class MouseControl extends TouchController {

  constructor({scene, canvas}) {
    super({scene, canvas});
    this.lastMousePosition = {x: 0, y: 0};

    this.mouseScrollSpeedSubscribtion = getIn(['map', 'scrollSpeed'])
      .subscribe(data => this.mouseScrollSpeed = data);

    this.mouseScrollDirectionSubscribtion = getIn(['map', 'scrollDirection'])
      .subscribe(data => this.mouseScrollDirection = data);

    const div = scene.parent;
    div.onmousemove = (e) => {
      e.preventDefault();

      const roundedX = e.clientX | 0;
      const roundedY = (e.clientY | 0) + theme.footer.height;
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
    ro.on(div, 'wheel')
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

        if(deltaY < 0) {
          zoom = Math.max(-50, Math.min(-1, zoom));
        } else {
          zoom = Math.min(50, Math.max(1, zoom));
        }

        this.zoom(-zoom * this.mouseScrollDirection * this.mouseScrollSpeed);
      });
  }

  dispose() {
    super.dispose();

    this.mouseScrollDirectionSubscribtion.dispose();
    this.mouseScrollSpeedSubscribtion.dispose();
  }
}
