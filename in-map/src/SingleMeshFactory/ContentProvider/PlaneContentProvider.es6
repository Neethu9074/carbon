import ContentProvider from './ContentProvider';


const PLANE_VERTICES = [
  -0.5, 0, 0.5,
  0.5, 0, 0.5,
  0.5, 0, -0.5,

  -0.5, 0, 0.5,
  0.5, 0, -0.5,
  -0.5, 0, -0.5
];

// initialize an array with 1 values [1, 1, 1, 1, ...]
const DEFAULT_COLOR = Array.apply(null, Array(PLANE_VERTICES.length)).map(() => 1);

export default class PlaneContentProvider extends ContentProvider {

  getVertices() {
    return PLANE_VERTICES.slice();
  }

  getColors() {
    return DEFAULT_COLOR.slice();
  }
}
