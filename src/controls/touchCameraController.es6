'use strict';

import THREE from 'three';

import CameraController from './cameraController';


//see: https://github.com/instana/visualization/
//commit/2a09db973b63cfbfa22b1b94769c0ca5c887628b/
//src/images/scetches/mouseControl.png
class TouchControl extends CameraController{

  constructor({scene}) {
    super({scene});
    this.bindListeners();

    this.moveSpeed = 0.005;
    this.pitchSpeed = 0.3;

    const canvas = scene.parent;
    canvas.addEventListener('touchstart', this.onTouchStart);
    canvas.addEventListener('touchmove', this.onTouchMove);
    canvas.addEventListener('touchend', this.onTouchEnd);
  }

  bindListeners() {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
  }

  onTouchStart(e) {
    e.preventDefault();
    this.unitsMoved = 0;

    //if it is a multi finger gesture
    if(e.touches.length >= 2) {
      this.scaling = true;
      this.touchDown = false;

    } else {
      this.touchDown = true;
      this.cursor.x = e.touches[0].clientX;
      this.cursor.y = e.touches[0].clientY;
    }
  }

  onTouchEnd(e) {
    e.preventDefault();
    this.touchDown = false;

    //if it was a multi finger gesture
    if(this.scaling) {
      this.scaling = false;

    } else {
      if (this.unitsMoved < 75) {
        this.getObjectOnCursor();
        this.doClick();
      }
      this.lastDistance = 0;
    }

    this.lastDistance = 0;
    this.unitsMoved = 0;
  }

  onTouchMove(e) {
    e.stopPropagation();
    e.preventDefault();

    if(this.scaling) {
      this.touchZoom(e);

    } else {
      this.pitch(e);
    }

    this.cursor.x = e.touches[0].clientX;
    this.cursor.y = e.touches[0].clientY;
  }

  touchZoom(e) {
    const dist = Math.sqrt(
      Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
      Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));

    if(this.lastDistance === 0) {
      this.lastDistance = dist;
    }

    const delta = this.lastDistance - dist;
    this.zoom(-delta * this.pitchSpeed);
    this.lastDistance = dist;
  }

  pitch(e) {
    this.lastDistance = 0;
    if(this.touchDown) {
      //calculate the delta between old (frame-1) and this position
      const dx = (e.touches[0].clientX - this.cursor.x);
      const dy = (e.touches[0].clientY - this.cursor.y);

      this.move(dx, dy);
    }
  }
}

export default TouchControl;
