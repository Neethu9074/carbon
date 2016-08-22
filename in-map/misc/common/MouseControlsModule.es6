import {onWheel, onMove, onLeave} from 'in-services/reactiveMouseEvents';
import Module from 'in-map/misc/common/Module';
import {theme} from 'in-services/theme';


export default class MouseControlModule extends Module {

  constructor(params) {
    super(params);

    this.initEvents();
  }

  initEvents() {
    const domElement = this.canvas;

    this.addSubscriptions([
      onMove(domElement, e  => {
        e.preventDefault();

        this.eventEmitter.emit('onMouseMoved', {
          x: e.clientX | 0,
          y: (e.clientY | 0) - theme.header.height
        });
      }),

      onLeave(domElement, () => {
        this.client.setCursorPosition({
          x: Infinity,
          y: Infinity
        });
        this.eventEmitter.emit('onMouseLeave');
      }),

      onWheel(domElement, event => {
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
      })
    ]);
  }
}
