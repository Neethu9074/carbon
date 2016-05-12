import {onWheel, onMove} from 'in-services/reactiveMouseEvents';
import {cursorPosition} from 'in-map/src/mapStores';
import {theme} from 'in-services/theme';

import Module from './Module';


export default class MouseControlModule extends Module {

  constructor({eventEmitter, scene}) {
    super(eventEmitter);

    this.scene = scene;
    this.lastMousePosition = {x: 0, y: 0};
    this.setupEvents();
  }

  setupEvents() {
    const div = this.scene.parent;

    this.addSubscriptions([
      onMove(div, e  => {
        e.preventDefault();

        const roundedX = e.clientX | 0;
        const roundedY = (e.clientY | 0) + theme.footer.height;
        if (this.lastMousePosition.x !== roundedX ||
          this.lastMousePosition.y !== roundedY) {
            this.lastMousePosition.x = roundedX;
            this.lastMousePosition.y = roundedY;

            cursorPosition.emit(this.lastMousePosition);
            this.eventEmitter.emit('onMouseMoved', this.lastMousePosition);
          }
        }),

      onWheel(div, event => {
        const deltaY = event.rawEvent.deltaY;

        // Because we listen to onwheel, the e.deltaY "should be" in a range of
        // +/- 0 .. 200, but sometimes is much larger due to "buffering" of scroll
        // events. Our map prefers values in the range of
        // +/- 0 .. 50. Because we cannot prevent buffering (browser seems not to)
        // react to user scroll, we at least prevent zooming way to much by capping
        // the value.

        // Touchy devices tend to send more frequent smaller scrolls, while "old"
        // mice send stable large ticks.

        // scale down
        const zoom = Math.max(-50, Math.min(50, Math.abs(deltaY / 4) | 0));

        this.eventEmitter.emit('onZoom', -zoom * event.scrollSpeed * event.scrollDirection);
      })
    ]);
  }

  dispose() {
    super.dispose();

    this.scene = null;
    this.lastMousePosition = null;
  }
}
