import ContentProvider from './ContentProvider';

/*eslint-disable no-unused-vars*/
const defaultColor = [
  0.8, 0.8, 0.8, //front
  0.9, 0.9, 0.9, //top
  1, 1, 1 //left
];
/*eslint-enable no-unused-vars*/

export default class CubeContentProvider extends ContentProvider {

  constructor({numSlices = 1, faceColors=defaultColor}) {
    super();
    this.faceColors = faceColors;
    this.numSlices = numSlices;
  }

  getVertices() {
    const totalHeight = 1;
    const numSlices = this.numSlices;
    const heightPerSlice = totalHeight / numSlices;

    let vertices = [];
    for (let i = 0; i < numSlices; i++) {
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

    return vertices;
  }

  getColors() {
    return defaultColor;
  }
}
