'use strict';

import Hammer from 'hammerjs';

import CameraController from './CameraController_temp';
import {createLogger} from 'instalog';
import {longClickedSceneObject} from '../stores/selectedSceneObject';
import ProgressTooltip from '../sceneObjects/Tooltips/ProgressCircle';
import eventBus from 'instana-ui-services/eventbus';

const logger = createLogger('ui-map.TouchControl');


export default class TouchControl extends CameraController{

  constructor({scene}) {
    super({scene});

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
      this.tooltip = new ProgressTooltip(this.scene);
    });

    eventHandler.on('panend pressup', this.cancelPressing.bind(this));

    eventBus.on('longClicked').subscribe(() => {
      this.cancelPressing();
      if(this.hittenObject) {
        longClickedSceneObject.emit(this.hittenObject.parentSceneObject);
      }
    });
  }

  cancelPressing() {
    if(this.tooltip) {
      this.tooltip.dispose();
      this.tooltip = null;
    }
  }

  onPan(e) {
    this.cancelPressing();

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
