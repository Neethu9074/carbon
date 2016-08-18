import Hammer from 'hammerjs';

import Module from 'in-map/misc/common/Module';


export default class TouchControlModule extends Module {

  constructor(params) {
    super(params);

    this.timeSinceLastTap = Date.now();
    this.pinchDistance = 0;

    // holds the mouse/touch position in pixel coordinates
    this.cursor = { x: 0, y: 0 };
    this.initEvents();
  }

  initEvents() {
    const eventHandler = this.eventHandler = new Hammer(this.canvas);
    const minMovementForPan = 15;

    eventHandler.on('panstart', this.onPanStart.bind(this));
    eventHandler.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: minMovementForPan
    });
    eventHandler.on('pan', this.onPan.bind(this));
    eventHandler.on('panend', this.onPanEnd.bind(this));

    eventHandler.get('pinch').set({enable: true});
    eventHandler.on('pinchin', this.onPinchIn.bind(this));
    eventHandler.on('pinchout', this.onPinchOut.bind(this));
    eventHandler.on('pinchstart', () => this.pinchDistance = 0);

    eventHandler.get('tap').set({threshold: minMovementForPan - 1});
    eventHandler.on('tap', this.onTab.bind(this));

    eventHandler.get('press').set({
      time: 300, // minimal press time in ms
      threshold: minMovementForPan - 1
    });
  }

  checkDoubleClick() {
    const now = Date.now();
    const deltaTime = (now - this.timeSinceLastTap);
    this.timeSinceLastTap = now;
    if (deltaTime < 300) {
      return true;
    }
    return false;
  }

  onPanStart(e) {
    this.setCursorToEvent(e);
    this.eventEmitter.emit('onPanStart');
  }

  onPan(event) {
    const pointer = event.pointers[0];
    const dx = (pointer.clientX - this.cursor.x);
    const dy = (pointer.clientY - this.cursor.y);

    this.setCursorToEvent(event);

    this.eventEmitter.emit('onMove', {dx, dy});
  }

  onPanEnd() {
    this.eventEmitter.emit('onPanEnd');
  }

  onTab(e) {
    if (this.checkDoubleClick()) {
      this.eventEmitter.emit('onDoubleClicked');
    }
    this.setCursorToEvent(e);
    this.eventEmitter.emit('onClicked');
  }

  onPinchIn(e) {
    this.onPinch(e.distance);
  }

  onPinchOut(e) {
    this.onPinch(e.distance * -1);
  }

  onPinch(newDistance) {
    const oldDistance = this.pinchDistance;
    const delta = newDistance - oldDistance;
    this.pinchDistance = newDistance;

    this.eventEmitter.emit('onZoom', delta);
  }

  setCursorToEvent(event) {
    const pointer = event.pointers[0];
    this.cursor.x = pointer.clientX;
    this.cursor.y = pointer.clientY;
  }

  dispose() {
    super.dispose();

    this.eventHandler.destroy();
    this.timeSinceLastTap = null;
    this.pinchDistance = null;
    this.canvas = null;
    this.cursor = null;
  }
}
