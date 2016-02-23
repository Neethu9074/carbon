import LineContentProvider from './LineContentProvider';


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

export default class FrameContentProvider extends LineContentProvider {

  constructor(color) {
    super(color);
  }

  getVertices() {
    this.setLines(FRAME.slice());
    return super.getVertices();
  }
}
