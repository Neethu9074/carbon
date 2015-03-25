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


class HostCube extends BaseCube {
  constructor(app, pos, dim, dataProvider) {
    super(app, pos, dim, dataProvider);
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
}

export default HostCube;
