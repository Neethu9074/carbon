const FRAME = [
  -0.5, 0, -0.5,
  0.5, 0, -0.5,

  0.5, 0, -0.5,
  0.5, 0, 0.5,

  0.5, 0, 0.5,
  -0.5, 0, 0.5,

  -0.5, 0, 0.5,
  -0.5, 0, -0.5
];

const COLORS = [
  1, 1, 1,
  1, 1, 1,

  1, 1, 1,
  1, 1, 1,

  1, 1, 1,
  1, 1, 1,

  1, 1, 1,
  1, 1, 1
];

const contentProvider = {
  getVertices: () => {
    return FRAME;
  },

  getColors: () => {
    return COLORS;
  }
};

export default contentProvider;
