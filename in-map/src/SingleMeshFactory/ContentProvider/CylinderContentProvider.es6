import {theme} from 'in-services/theme';

import ContentProvider from './ContentProvider';


const CYLINDER_VERTICES = [
  -0.433, 0, 0.25,
  0, 0, 0.5,
  0, 1, 0.5,

  -0.433, 0, 0.25,
  0, 1, 0.5,
  -0.433, 1, 0.25,

  -0.433, 0, -0.25,
  -0.433, 0, 0.25,
  -0.433, 1, 0.25,

  -0.433, 0, -0.25,
  -0.433, 1, 0.25,
  -0.433, 1, -0.25,

  0, 0, 0.5,
  0.433, 0, 0.25,
  0.433, 1, 0.25,

  0, 0, 0.5,
  0.433, 1, 0.25,
  0, 1, 0.5,

  -0.433, 1, 0.25,
  0, 1, 0.5,
  0, 1, 0,

  0, 1, 0.5,
  0.433, 1, 0.25,
  0, 1, 0,

  0.433, 1, 0.25,
  0.433, 1, -0.25,
  0, 1, 0,

  0.433, 1, -0.25,
  0, 1, -0.5,
  0, 1, 0,

  0, 1, -0.5,
  -0.433, 1, -0.25,
  0, 1, 0,

  -0.433, 1, -0.25,
  -0.433, 1, 0.25,
  0, 1, 0
];


const CUBE_COLOR_FALLOFF_VALUES = theme.map.colors.cubeColorFalloffValues;
const FRONT = CUBE_COLOR_FALLOFF_VALUES.top;
const RIGHT = CUBE_COLOR_FALLOFF_VALUES.right;
const LEFT = 1;

const DEFAULT_COLOR = [
  // front
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,

  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,

  // left
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,

  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,


  // right
  RIGHT.r, RIGHT.g, RIGHT.b,
  RIGHT.r, RIGHT.g, RIGHT.b,
  RIGHT.r, RIGHT.g, RIGHT.b,

  RIGHT.r, RIGHT.g, RIGHT.b,
  RIGHT.r, RIGHT.g, RIGHT.b,
  RIGHT.r, RIGHT.g, RIGHT.b,

  // top
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,

  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,

  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,

  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,

  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,

  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT,
  LEFT, LEFT, LEFT
];

export default class CylinderContentProvider extends ContentProvider {

  constructor() {
    super();
    this.cachedColors = DEFAULT_COLOR;
  }

  getVertices() {
    return CYLINDER_VERTICES.slice();
  }

  getColors() {
    return DEFAULT_COLOR.slice();
  }
}
