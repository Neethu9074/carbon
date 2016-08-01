export default function createContentProvider(verticeCallback, colorCallback) {
  return {
    getVertices: () => {
      return verticeCallback();
    },

    getColors: () => {
      return colorCallback();
    }
  };
}
