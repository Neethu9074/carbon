import Hammer from 'hammerjs';

import eventBus from 'in-services/eventbus';

import {longClickedSceneObject, currentTooltip} from '../stores/mapStore';
import ProgressTooltip from '../sceneObjects/Tooltips/ProgressCircle';
import CameraController from './CameraController_temp';


export default class TouchControl extends CameraController{

  constructor({scene}) {
    super({scene});

    this.timeSinceLastTap = Date.now();
    this.pinchDistance = 0;

    const canvas = scene.renderer.domElement;
    const eventHandler = new Hammer(canvas);
    const minMovementForPan = 15;

    eventHandler.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: minMovementForPan
    });
    eventHandler.on('pan', this.onPan.bind(this));

    eventHandler.on('panstart', (e) => this.setCursorToEvent(e));
    eventHandler.on('pinch', this.onPinch.bind(this));
    eventHandler.on('pinchstart', () => this.pinchDistance = 0);

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

  onPinch(e) {
    const oldDistance = this.pinchDistance;
    const newDistance = e.distance;
    const delta = newDistance - oldDistance;
    this.pinchDistance = newDistance;

    this.zoom(delta);
  }

  setCursorToEvent(event) {
    this.cursor.x = event.pointers[0].clientX;
    this.cursor.y = event.pointers[0].clientY;
  }
}
