'use strict';

import THREE from 'three';

import CameraController from './cameraController';


export default class MouseControl extends CameraController {

  constructor({scene}) {
    super({scene});

    this.bindListeners();

    //a counter increased by the update loop to counter the num of update calls
    this.counterForRayCasting = 0;

    this.leftMouseButtonIsPressed = false;

    const canvas = scene.parent;
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('mouseout', this.onMouseOut);

    // Wheel event is new (IE10+, Chrome 31+, FF 17+, Safari 7), but produces
    // a consistent range of scroll events.
    canvas.addEventListener('wheel', this.onWheel);
  }

  bindListeners() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onWheel = this.onWheel.bind(this);
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

  onMouseDown(e) {
    e.preventDefault();
    if (e.button === 0) {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;

      //save the state for mouse move
      this.leftMouseButtonIsPressed = true;
    }
  }

  onMouseOut() {
    //reset the state when mouse left the map
    //this.leftMouseButtonIsPressed = false;
  }

  onMouseUp(e) {
    e.preventDefault();

    if (this.unitsMoved < 75) {
      //set the new position when clicking (needed for automated tests)
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;

      //pick the current object on cursor position
      this.getObjectOnCursor();
      this.doClick();
    }

    if(e.button === 0) {
      //save the state for mouse move
      this.leftMouseButtonIsPressed = false;
      this.unitsMoved = 0;
    }
  };

  onMouseMove(e) {
    e.preventDefault();
    //if left mouse button is pressed while dragging
    if (this.leftMouseButtonIsPressed) {
      //calculate the delta between old (frame-1) and this position
      const dx = (e.clientX - this.cursor.x);
      const dy = (e.clientY - this.cursor.y);
      this.move(dx, dy);
    }

    //don't forget to set the new position :)
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
  }
}
