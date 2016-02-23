import ContentProvider from './ContentProvider';


const POINT_VERTICES = [0, 0, 0];
const DEFAULT_COLOR = [1, 1, 1];

export default class PointContentProvider extends ContentProvider {

  constructor() {
    super();

    this.cachedColors = [1, 1, 1];
  }

  getVertices() {
    return POINT_VERTICES.slice();
  }

  getColors() {
    return DEFAULT_COLOR.slice();
  }
}
