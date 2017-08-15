import MainAsciiSceneNode from 'in-map/SceneGraph/MainAsciiSceneNode';

export default class SceneGraph {
  constructor(canvas) {
    this.root = new MainAsciiSceneNode({
      id: 'mainScene',
      canvas
    });
  }

  dispose() {
    this.root.dispose();
    this.root = null;
  }
}
