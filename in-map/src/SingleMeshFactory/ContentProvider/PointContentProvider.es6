import ContentProvider from './ContentProvider';

export default class PointContentProvider extends ContentProvider {

  constructor() {
    super();

    this.cachedColors = [1.0, 0.0, 0.5];
  }

  getVertices() {
    return [0, 0, 1];
  }

  getColors() {
    return this.cachedColors.slice();
  }
}
