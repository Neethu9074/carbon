import Hammer from 'hammerjs';

import MouseCameraController from './MouseCameraController_temp';


export default class TouchControl extends MouseCameraController {

  constructor({scene, canvas, camera}) {
    super({scene, camera});

    this.timeSinceLastTap = Date.now();
    this.pinchDistance = 0;
    this.cursor = { x: 0, y: 0 };

    const eventHandler = this.eventHandler = new Hammer(canvas);
    const minMovementForPan = 15;

    eventHandler.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: minMovementForPan
    });
    eventHandler.on('pan', this.onPan.bind(this));

    eventHandler.on('panstart', (e) => this.setCursorToEvent(e));
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

  emitLongClick() {
    this.onDoubleClicked();
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

  onPan(event) {
    const pointer = event.pointers[0];
    const dx = (pointer.clientX - this.cursor.x);
    const dy = (pointer.clientY - this.cursor.y);

    this.setCursorToEvent(event);

    this.move(dx, dy);
  }

  onTab(e) {
    if (this.checkDoubleClick()) {
      this.emitLongClick();
    }
    this.setCursorToEvent(e);
    this.onClick();
  }

  onPinchIn(event) {
    this.onPinch(event.distance);
  }

  onPinchOut(event) {
    this.onPinch(event.distance * -1);
  }

  onPinch(newDistance) {
    const oldDistance = this.pinchDistance;
    const delta = newDistance - oldDistance;
    this.pinchDistance = newDistance;

    this.zoom(delta);
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
  }
}
