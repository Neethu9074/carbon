'use strict';

import ContentProvider from './ContentProvider';

/*eslint-disable no-unused-vars*/
const defaultColor = [
  0.8, 0.8, 0.8, //front
  0.9, 0.9, 0.9, //top
  1, 1, 1 //left
];
/*eslint-enable no-unused-vars*/

export default class FrameContentProvider extends ContentProvider {

  constructor(faceColors=defaultColor) {
    this.faceColors = faceColors;
  }

  getVertices({pos={x: 0, z: 0}, size={x: 1, y: 1, z: 1}}) {

    const sizeXHalf = size.x / 2;
    const sizeZHalf = size.z / 2;
    const posX = pos.x;
    const posZ = pos.z;

    return [
      {x: posX - sizeXHalf, y: 0, z: posZ - sizeZHalf},
      {x: posX + sizeXHalf, y: 0, z: posZ - sizeZHalf},

      {x: posX + sizeXHalf, y: 0, z: posZ - sizeZHalf},
      {x: posX + sizeXHalf, y: 0, z: posZ + sizeZHalf},

      {x: posX + sizeXHalf, y: 0, z: posZ + sizeZHalf},
      {x: posX - sizeXHalf, y: 0, z: posZ + sizeZHalf},

      {x: posX - sizeXHalf, y: 0, z: posZ + sizeZHalf},
      {x: posX - sizeXHalf, y: 0, z: posZ - sizeZHalf}
    ];
  }

  getColors() {
    return defaultColor;
  }
}
