'use strict';

import Hammer from 'hammerjs';

import CameraController from './CameraController_temp';
import {createLogger} from 'instalog';
import {longClickedSceneObject, currentTooltip} from '../stores/mapStore';
import ProgressTooltip from '../sceneObjects/Tooltips/ProgressCircle';
import eventBus from 'instana-ui-services/eventbus';

const logger = createLogger('ui-map.TouchControl');


export default class TouchControl extends CameraController{

  constructor({scene}) {
    super({scene});

    this.timeSinceLastTap = Date.now();

    const canvas = scene.parent;
    const eventHandler = new Hammer(canvas);
    const minMovementForPan = 15;

    eventHandler.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: minMovementForPan
    });
    eventHandler.on('pan', this.onPan.bind(this));

    eventHandler.on('panstart', (e) => this.setCursorToEvent(e));
    eventHandler.on('pinch', this.onPinch.bind(this));

    eventHandler.get('tap').set({threshold: minMovementForPan - 1});
    eventHandler.on('tap', this.onTab.bind(this));

    eventHandler.get('press').set({
      time: 300, // minimal press time in ms
      threshold: minMovementForPan - 1
    });
    eventHandler.on('press', () => {
      currentTooltip.emit(new ProgressTooltip(this.scene));
    });

    eventHandler.on('panend pressup', this.cancelPressing.bind(this));

    eventBus.on('longClicked').subscribe(() => {
      this.cancelPressing();
      this.emitLongClick();
    });
  }

  emitLongClick() {
    if(this.hittenObject) {
      longClickedSceneObject.emit(this.hittenObject.parentSceneObject);

      //also perform a simple click
      this.doClick();
    }
  }

  checkDoubleClick() {
    const now = Date.now();
    const deltaTime = (now - this.timeSinceLastTap);
    this.timeSinceLastTap = now;
    if(deltaTime < 300) {
      return true;
    }
    return false;
  }

  cancelPressing() {
    currentTooltip.emit(null);
  }

  onPan(e) {
    this.cancelPressing();

    const dx = (e.pointers[0].clientX - this.cursor.x);
    const dy = (e.pointers[0].clientY - this.cursor.y);

    this.setCursorToEvent(e);

    this.move(dx, dy);
  }

  onTab(e) {
    if(this.checkDoubleClick()) {
      this.emitLongClick();
    }

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
