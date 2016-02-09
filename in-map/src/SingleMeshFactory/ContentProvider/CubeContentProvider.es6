import {theme} from 'in-services/theme';

import ContentProvider from './ContentProvider';


const CUBE_VERTICES = [
  // front
  -0.5, 0, 0.5,
  0.5, 0, 0.5,
  0.5, 1, 0.5,

  -0.5, 0, 0.5,
  0.5, 1, 0.5,
  -0.5, 1, 0.5,

  // top
  -0.5, 1, 0.5,
  0.5, 1, 0.5,
  0.5, 1, -0.5,

  -0.5, 1, 0.5,
  0.5, 1, -0.5,
  -0.5, 1, -0.5,

  // left
  -0.5, 0, -0.5,
  -0.5, 0, 0.5,
  -0.5, 1, -0.5,

  -0.5, 0, 0.5,
  -0.5, 1, 0.5,
  -0.5, 1, -0.5
];

const CUBE_COLOR_FALLOFF_VALUES = theme.map.colors.cubeColorFalloffValues;
const FRONT = CUBE_COLOR_FALLOFF_VALUES.right;
const TOP = CUBE_COLOR_FALLOFF_VALUES.top;
const LEFT = 1;

const DEFAULT_COLOR = [
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,

  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,

  TOP.r, TOP.g, TOP.b,
  TOP.r, TOP.g, TOP.b,
  TOP.r, TOP.g, TOP.b,

  TOP.r, TOP.g, TOP.b,
  TOP.r, TOP.g, TOP.b,
  TOP.r, TOP.g, TOP.b,

  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,

  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT
];

export default class CubeContentProvider extends ContentProvider {

  getVertices() {
    return CUBE_VERTICES.slice();
  }

  getColors() {
    return DEFAULT_COLOR.slice();
  }
}
