import MainSceneNode from 'in-map/SceneGraph/MainSceneNode';
import AsciiScene from 'in-map/sceneObjects/AsciiScene';

export default class AsciiSceneGraph {
  constructor(canvas) {
    this.root = new MainSceneNode({
      id: 'mainScene',
      canvas,
      InstanceType: AsciiScene
    });
  }

  dispose() {
    this.root.dispose();
    this.root = null;
  }
}
