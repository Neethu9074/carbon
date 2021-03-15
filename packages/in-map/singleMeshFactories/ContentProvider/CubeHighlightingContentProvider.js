/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const MARGIN = 1.05;

const VERTICES = [
  // front
  MARGIN * -0.5,
  0,
  -0.5 * MARGIN,
  MARGIN * -0.5,
  0,
  0.5 * MARGIN,
  MARGIN * -0.5,
  0,
  0.5 * MARGIN,
  MARGIN * 0.5,
  0,
  0.5 * MARGIN,
  // sides
  MARGIN * 0.5,
  0,
  0.5 * MARGIN,
  MARGIN * 0.5,
  1,
  0.5 * MARGIN,
  MARGIN * -0.5,
  0,
  -0.5 * MARGIN,
  MARGIN * -0.5,
  1,
  -0.5 * MARGIN,
  // top
  MARGIN * -0.5,
  1,
  -0.5 * MARGIN,
  MARGIN * 0.5,
  1,
  -0.5 * MARGIN,
  MARGIN * 0.5,
  1,
  -0.5 * MARGIN,
  MARGIN * 0.5,
  1,
  0.5 * MARGIN
];

const COLORS = [];
for (let i = 0; i <= VERTICES.length; i++) {
  COLORS[i] = 1;
}

export default {
  getVertices: () => {
    return VERTICES;
  },

  getColors: () => {
    return COLORS;
  }
};
