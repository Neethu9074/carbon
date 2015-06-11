'use strict';

import THREE from 'three';
import Hammer from 'hammerjs';

import CameraController from './cameraController';
import {createLogger} from 'instalog';

const logger = createLogger('ui-map.TouchControl');


export default class TouchControl extends CameraController{

  constructor({scene}) {
    super({scene});

    const canvas = scene.parent;
    const eventHandler = new Hammer(canvas);

    eventHandler.get('pan').set({direction: Hammer.DIRECTION_ALL});
    eventHandler.on('pan', this.onPan.bind(this));

    eventHandler.on('panstart', (e) => this.setCursorToEvent(e));
    eventHandler.on('tap', this.onTab.bind(this));
    eventHandler.on('pinch', this.onPinch.bind(this));
  }

  onPan(e) {
    const dx = (e.pointers[0].clientX - this.cursor.x);
    const dy = (e.pointers[0].clientY - this.cursor.y);

    this.setCursorToEvent(e);

    this.move(dx, dy);
  }

  onTab(e) {
    this.setCursorToEvent(e);

    this.getObjectOnCursor();
    this.doClick();
  }

  onPinch() {
    //TODO: implement
    logger.debug('implement pinch event');
  }

  setCursorToEvent(event) {
    this.cursor.x = event.pointers[0].clientX;
    this.cursor.y = event.pointers[0].clientY;
  }
}
