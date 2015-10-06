import ContentProvider from './ContentProvider';

export default class CubeContentProvider extends ContentProvider {

  constructor() {
    super();

    this.cachedColors = [1.0, 0.0, 0.5 ];
  }

  getVertices() {
    return [0, 0, 0];
  }

  getColors() {
    return this.cachedColors.slice();
  }
}
