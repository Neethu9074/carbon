export default function createContentProvider(verticeCallback, colorCallback) {
  return {
    getVertices: () => {
      return verticeCallback();
    },

    getColors: vertices => {
      return colorCallback(vertices);
    }
  };
}
