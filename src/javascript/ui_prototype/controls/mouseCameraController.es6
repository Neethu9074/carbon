'use strict';

import THREE from 'three.js';

import CameraController from './cameraController';


//see: https://github.com/instana/visualization/
//commit/2a09db973b63cfbfa22b1b94769c0ca5c887628b/
//src/images/scetches/mouseControl.png
class MouseControl extends CameraController {

  constructor() {
    super();

    const app = this.appReference;
    this.bindListeners();

    this.counterForRayCasting = 0;
    this.unitsMoved = 0;

    app.canvas.addEventListener('mousedown', this.onMouseDown);
    app.canvas.addEventListener('mousemove', this.onMouseMove);
    app.canvas.addEventListener('mouseup', this.onMouseUp);
    app.canvas.addEventListener('mouseout', this.onMouseOut);

    // IE9, Chrome, Safari, Opera
    app.canvas.addEventListener('mousewheel', this.onMouseWheel, false);
    // Firefox
    app.canvas.addEventListener('DOMMouseScroll', this.onMozMouseWheel, false);
  }

  bindListeners() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMozMouseWheel = this.onMozMouseWheel.bind(this);
  }

  onMouseWheel(e) {
    e.preventDefault();
    e = window.event || e; // old IE support

    this.zoom(e.wheelDelta / 50);
  }

  onMozMouseWheel(e) {
    e.preventDefault();

    this.zoom(-e.detail);
  }

  onMouseDown(e) {
    e.preventDefault();
    if (e.button === 0) {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;

      this.pixelMoved = 0;

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

    if (this.unitsMoved < 100) {
      //set the new position when clicking (needed for automated tests)
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;

      //pick the current object on cursor position
      this.doRayPicking();

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

  update(dTime) {
    //do it only every x times
    if ((this.counterForRayCasting++ % 5) === 0) {
      this.doRayPicking();
    }

    super.update(dTime);
  }
}

export default MouseControl;
