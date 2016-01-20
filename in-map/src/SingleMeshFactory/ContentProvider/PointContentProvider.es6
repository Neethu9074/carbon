import ContentProvider from './ContentProvider';

export default class PointContentProvider extends ContentProvider {

  constructor() {
    super();

    this.cachedColors = [1, 1, 1];
  }

  getVertices() {
    return [0, 0, 0];
  }

  getColors() {
    return this.cachedColors.slice();
  }
}
