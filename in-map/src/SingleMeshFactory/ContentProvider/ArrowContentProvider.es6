import THREE from 'three';

import ContentProvider from './ContentProvider';


const PLANE_VERTICES = [
  -0.5, 0, 0,
  0.5, 0, 0,
  0, 1, 0
];

// initialize an array with 1 values [1, 1, 1, 1, ...]
const DEFAULT_COLOR = Array.apply(null, Array(PLANE_VERTICES.length)).map(() => 1);

const ARROW_LENGTH = 0.5;
const ARROW_WIDTH = 0.3;

export default class ArrowContentProvider extends ContentProvider {
  constructor() {
    super();

    this.colors = DEFAULT_COLOR.slice();
    this.vertices = PLANE_VERTICES.slice();
  }

  // you can give two positions. This method will draw an arrow with the ending point
  // at the second position. The up vector is (0, 1, 0), so only x and z coords are used.
  // the arrow is 0.5 units long and 0.3 unit width
  setFromTo(fromPos, toPos) {
    fromPos.x -= 0.5;
    fromPos.z += 0.5;
    toPos.x -= 0.5;
    toPos.z += 0.5;
    const direction = new THREE.Vector3(toPos.x - fromPos.x,
                                        0,
                                        toPos.z - fromPos.z);

    direction.normalize();
    toPos.sub(direction.clone().multiplyScalar(0.5));

    direction.multiplyScalar(ARROW_LENGTH);
    const arrowStart = toPos.sub(direction);

    const right = new THREE.Vector3(0, 1, 0).cross(direction);
    right.normalize().multiplyScalar(ARROW_WIDTH / 2);

    const left = right.clone().multiplyScalar(-1);

    this.vertices = [
      arrowStart.x + left.x, 0.01, arrowStart.z + left.z,
      arrowStart.x + right.x, 0.01, arrowStart.z + right.z,
      direction.x + toPos.x, 0.01, direction.z + toPos.z
    ];
  }

  setColor(colors) {
    for (let i = 0; i < this.colors.length; i += 3) {
      this.colors[i] = colors.r;
      this.colors[i + 1] = colors.g;
      this.colors[i + 2] = colors.b;
    }
  }

  getVertices() {
    return this.vertices;
  }

  getColors() {
    return this.colors;
  }
}
