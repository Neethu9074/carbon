const VERTICES = [
  -0.5, 0, -0.5,
  0.5, 0, -0.5,

  0.5, 0, -0.5,
  0.5, 0, 0.5,

  0.5, 0, 0.5,
  -0.5, 0, 0.5,

  -0.5, 0, 0.5,
  -0.5, 0, -0.5
];

const COLORS = new Array(VERTICES.length).fill(1);

export default {
  getVertices: () => {
    return VERTICES;
  },

  getColors: () => {
    return COLORS;
  }
};
