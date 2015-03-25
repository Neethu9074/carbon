'use strict';

import THREE from 'three.js';

import BaseCube from './baseCube';
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

const logger = createLogger('containerCube.js');


class ContainerCube extends BaseCube {
  constructor(app, pos, dim, dataProvider) {
    super(app, pos, dim, dataProvider);
  }

	addContainerToPosWithDim() {
		logger.error('not supported yet: container inside container');
    return undefined;
	}
}

export default ContainerCube;
