/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { cubeColorFalloffValues } from 'in-map/components/infraMapColors';

const VERTICES = [
  // front
  -0.5, 0, 0.5, 0.5, 0, 0.5, 0.5, 1, 0.5, -0.5, 0, 0.5, 0.5, 1, 0.5, -0.5, 1, 0.5,
  // top
  -0.5, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, -0.5, -0.5, 1, 0.5, 0.5, 1, -0.5, -0.5, 1, -0.5,
  // left
  -0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 1, -0.5, -0.5, 0, 0.5, -0.5, 1, 0.5, -0.5, 1, -0.5
];

const CUBE_COLOR_FALLOFF_VALUES = cubeColorFalloffValues;
const FRONT = CUBE_COLOR_FALLOFF_VALUES.right;
const TOP = CUBE_COLOR_FALLOFF_VALUES.top;
const LEFT = 1;

const COLORS = [
  FRONT.r,
  FRONT.g,
  FRONT.b,
  FRONT.r,
  FRONT.g,
  FRONT.b,
  FRONT.r,
  FRONT.g,
  FRONT.b,
  FRONT.r,
  FRONT.g,
  FRONT.b,
  FRONT.r,
  FRONT.g,
  FRONT.b,
  FRONT.r,
  FRONT.g,
  FRONT.b,
  TOP.r,
  TOP.g,
  TOP.b,
  TOP.r,
  TOP.g,
  TOP.b,
  TOP.r,
  TOP.g,
  TOP.b,
  TOP.r,
  TOP.g,
  TOP.b,
  TOP.r,
  TOP.g,
  TOP.b,
  TOP.r,
  TOP.g,
  TOP.b,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT,
  LEFT
];

export default {
  getVertices: () => {
    return VERTICES;
  },

  getColors: () => {
    return COLORS;
  }
};
