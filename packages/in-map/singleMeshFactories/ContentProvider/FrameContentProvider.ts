/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const VERTICES = [
  -0.5,
  0,
  -0.5,
  0.5,
  0,
  -0.5,
  0.5,
  0,
  -0.5,
  0.5,
  0,
  0.5,
  0.5,
  0,
  0.5,
  -0.5,
  0,
  0.5,
  -0.5,
  0,
  0.5,
  -0.5,
  0,
  -0.5
];

const COLORS = new Array(VERTICES.length);
for (let i = 0, length = COLORS.length; i < length; i++) {
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
