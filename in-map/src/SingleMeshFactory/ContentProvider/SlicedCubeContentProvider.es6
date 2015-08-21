import ContentProvider from './ContentProvider';

const defaultColor = [
  0.8, 0.8, 0.8, //front
  0.9, 0.9, 0.9, //top
  1, 1, 1 //left
];

export default class SlicedCubeContentProvider extends ContentProvider {

  constructor({numSlices = 1, faceColors = defaultColor}) {
    super();

    this.numSlices = numSlices;
    this.faceColors = faceColors;

    this.calculatePositions();
    this.calculateColors();
    this.calculateSliceIndices();
  }

  calculateColors() {
    const faceColors = this.faceColors;
    let offset = 0;
    const colors = [];
    for (let iSlice = 0; iSlice < this.numSlices; iSlice++) {
      //front
      for (let i = 0; i < 18; i += 3) {
        colors[i + offset] = faceColors[0];
        colors[i + offset + 1] = faceColors[1];
        colors[i + offset + 2] = faceColors[2];
      }

      //top
      for (let i = 18; i < 36; i += 3) {
        colors[i + offset] = faceColors[3];
        colors[i + offset + 1] = faceColors[4];
        colors[i + offset + 2] = faceColors[5];
      }

      //left
      for (let i = 36; i < 54; i += 3) {
        colors[i + offset] = faceColors[6];
        colors[i + offset + 1] = faceColors[7];
        colors[i + offset + 2] = faceColors[8];
      }
      offset += 54;
    }
    this.cachedColors = colors;
  }

  calculatePositions() {
    const totalHeight = 1;
    const heightPerSlice = totalHeight / this.numSlices;

    let vertices = [];
    for (let i = 0; i < this.numSlices; i++) {
      const from = i * heightPerSlice;
      const to = (i + 1) * heightPerSlice;
      const slice = [
        //front
        -0.5, from, 0.5,
        0.5, from, 0.5,
        0.5, to, 0.5,

        -0.5, from, 0.5,
        0.5, to, 0.5,
        -0.5, to, 0.5,

        //top
        -0.5, to, 0.5,
        0.5, to, 0.5,
        0.5, to, -0.5,

        -0.5, to, 0.5,
        0.5, to, -0.5,
        -0.5, to, -0.5,

        //left
        -0.5, from, -0.5,
        -0.5, from, 0.5,
        -0.5, to, -0.5,

        -0.5, from, 0.5,
        -0.5, to, 0.5,
        -0.5, to, -0.5
      ];
      vertices = vertices.concat(slice);
    }
    this.cachedVertices = vertices;
  }

  calculateSliceIndices() {
    let indices = [];

    for (let i = 0; i < this.numSlices; i++) {
      const slice = [
        // front
        0, 0,
        0, 0,
        0, 0,

        0, 0,
        0, 0,
        0, 0,

        // top
        0, 0,
        0, 0,
        0, 0,

        0, 0,
        0, 0,
        0, 0,

        // left
        0, 0,
        0, 0,
        0, 0,

        0, 0,
        0, 0,
        0, 0
      ];
      indices = indices.concat(slice);
    }

    this.cachedIndices = indices;
  }


  getVertices() {
    return this.cachedVertices.slice();
  }

  getColors() {
    return this.cachedColors.slice();
  }

  getSliceIndices() {
    return this.cachedIndices.slice();
  }
}
