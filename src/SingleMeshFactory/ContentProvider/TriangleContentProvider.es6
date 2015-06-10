'use strict';

import THREE from 'three';
import _ from 'lodash';
import ContentProvider from './ContentProvider';


export default class TriangleContentProvider extends ContentProvider {

  constructor() {}

  getVertices() {
    return [
      -0.5, 0, 0,
      0.5, 0, 0,
      0, 1, 0
    ];
  }

  getColors() {
    return [
      0.9, 0, 0,
      0, 0.9, 0,
      0, 0, 0.9
    ];
  }
}
