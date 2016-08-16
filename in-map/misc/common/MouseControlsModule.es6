import {onWheel, onMove, onLeave} from 'in-services/reactiveMouseEvents';
import {theme} from 'in-services/theme';

import Module from 'in-map/misc/common/Module';


export default class MouseControlModule extends Module {

  constructor(eventEmitter, scene) {
    super(eventEmitter);

    this.scene = scene;
    this.lastMousePosition = {x: 0, y: 0};
    this.initEvents();
  }

  initEvents() {
    const canvas = this.scene.canvas;

    this.addSubscriptions([
      onMove(canvas, e  => {
        e.preventDefault();

        const roundedX = e.clientX | 0;
        const roundedY = (e.clientY | 0) - theme.header.height;
        if (this.lastMousePosition.x !== roundedX ||
          this.lastMousePosition.y !== roundedY) {
            this.lastMousePosition.x = roundedX;
            this.lastMousePosition.y = roundedY;

            this.eventEmitter.emit('onMouseMoved', this.lastMousePosition);
          }
        }),

      onWheel(canvas, event => {
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
        const zoom = Math.max(-50, Math.min(50, Math.abs(deltaY | 0) / 4));

        this.eventEmitter.emit('onZoom', -zoom * event.scrollSpeed * event.scrollDirection);
      }),

      onLeave(canvas, () => this.eventEmitter.emit('onMouseLeave'))
    ]);
  }

  dispose() {
    super.dispose();

    this.scene = null;
    this.lastMousePosition = null;
  }
}
