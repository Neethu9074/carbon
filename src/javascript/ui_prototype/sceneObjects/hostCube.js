'use strict';

import THREE from 'three.js';

import BaseCube from './baseCube';
import ContainerCube from './containerCube';
import ContainerDataProvider from '../dataProvider/containerDataProvider';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as math from '../math';

import Layouter from '../layouterContainer';
import {
  createLogger
}
from '../../log';

import _ from 'lodash';

const logger = createLogger('hostCube.js');
const hideCSS3DDistance = 100;


class HostCube extends BaseCube {

  constructor(app, pos, dim, dataProvider) {
    this.cubeOffset = 0.15; //85%
    super(app, pos, dim, dataProvider);

    this.app.updates.push(this);

    this.time = 0; //stores the time since last tick
    this.tick = 1; //tick in sec
  }

  addContainerToPosWithDim(pos, dim, metaData) {
    const container = new ContainerCube(this.app, pos, dim,
      new ContainerDataProvider(metaData));

    container.parentContainer = this;

    this.children.push(container);
    this.childrenContainer.add(container.cube);
    this.childrenContainer.add(container.content2D);

    return container;
  }

  dispose() {
    //remove this from apps update list
    _.remove(this.app.updates, obj => obj === this);
    this.time = null;
    this.tick = null;

    super.dispose();
  }

  onUpdate(dt) {
    this.time += dt;
    if(this.time < this.tick) {
      return;
    }

    //tick
    this.time = 0;

    const distanceToFocus = this.app.controller.lookAt.position.clone()
      .sub(this.position)
      .length();

    if(distanceToFocus > hideCSS3DDistance) {
      this.hideCSS3DLayer();
      return;
    }

    const distanceToCam = this.app.mainCamera.position.clone()
      .sub(this.position)
      .length() / 2;

    if(distanceToCam > hideCSS3DDistance) {
      this.hideCSS3DLayer();
      return;
    }

    this.showCSS3DLayer();
  }

  hideCSS3DLayer() {
    if(this.hidden){
      return;
    }

    //hide css
    this.app.scene.remove(this.content2D);
    this.hidden = true;
  }

  showCSS3DLayer() {
    if(!this.hidden){
      return;
    }

    //show css
    this.app.scene.add(this.content2D);
    this.hidden = false;
  }
}

export default HostCube;
