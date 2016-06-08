import ContentProvider from './ContentProvider';


const CYLINDRIC_PLANE_VERTICES = [
  -0.433, 0, 0.25,
  0, 0, 0.5,
  0, 0, 0,

  0, 0, 0.5,
  0.433, 0, 0.25,
  0, 0, 0,

  0.433, 0, 0.25,
  0.433, 0, -0.25,
  0, 0, 0,

  0.433, 0, -0.25,
  0, 0, -0.5,
  0, 0, 0,

  0, 0, -0.5,
  -0.433, 0, -0.25,
  0, 0, 0,

  -0.433, 0, -0.25,
  -0.433, 0, 0.25,
  0, 0, 0
];

// initialize an array with 0.2 values [0.2, 0.2, 0.2, 0.2, ...]
const DEFAULT_COLOR = Array.apply(null, Array(CYLINDRIC_PLANE_VERTICES.length)).map(() => 0.2);

export default class CylinderPlaneContentProvider extends ContentProvider {

  getVertices() {
    return CYLINDRIC_PLANE_VERTICES.slice();
  }

  getColors() {
    return DEFAULT_COLOR;
  }
}
