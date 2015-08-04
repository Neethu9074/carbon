'use strict';

import Component from './Component';


export default class HighlightingComponent extends Component{
  constructor({sceneObject}) {
    super(sceneObject);

    this.scaleToSet = {x: 1, y: 1, z: 1};
    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.setupHighlightBorderLines();

    this.initialized();
  }

  onInitialEnter() {
    this.show();
  }

  onInactiveEnter() {
    this.hide();
  }


  positionChanged(x, y, z) {
    const pos = this.positionToSet;
    if(pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    this.positionToSet = {x, y, z};
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    const scale = this.scaleToSet;
    if(scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.scaleToSet = {x, y, z};
    this.needsUpdate = true;
  }

  update30Fps() {
    this.setupHighlightBorderLines();

    this.hide();
    if(this.isActive()) {
      this.show();
    }

    this.needsUpdate = false;
  }

  setupHighlightBorderLines() {
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const fromX = pos.x + 0.01;
    const toX = pos.x - 1.01;
    const fromY = pos.y - 0.01;
    const toY = fromY + scale.y + 0.02;
    const fromZ = pos.z - 0.01;
    const toZ = pos.z + 1.01;

    const points = [
      {x: toX, y: fromY, z: fromZ},
      {x: toX, y: fromY, z: toZ},

      {x: toX, y: fromY, z: toZ},
      {x: fromX, y: fromY, z: toZ},

      {x: fromX, y: fromY, z: toZ},
      {x: fromX, y: fromY, z: fromZ},

      {x: fromX, y: fromY, z: fromZ},
      {x: toX, y: fromY, z: fromZ},

      {x: toX, y: fromY, z: fromZ},
      {x: toX, y: toY, z: fromZ},

      {x: fromX, y: fromY, z: toZ},
      {x: fromX, y: toY, z: toZ},

      {x: toX, y: toY, z: fromZ},
      {x: fromX, y: toY, z: fromZ},

      {x: fromX, y: toY, z: fromZ},
      {x: fromX, y: toY, z: toZ}
    ];

    this.fragment = {id: this.getID(), points, highlighted: true};
  }

  show() {
    this.sceneObject.scene.lineFactory.addFragment(this.fragment);
  }

  hide() {
    this.sceneObject.scene.lineFactory.removeFragment(this.getID());
  }

  getID() {
    return this.sceneObject.id + '_highlight';
  }
}
