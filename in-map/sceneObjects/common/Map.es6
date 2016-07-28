import SceneObject from 'in-map/sceneObjects/SceneObject';


export default class Map extends SceneObject {

  constructor(params) {
    super(params.id);

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
    this.scene = params.scene;
  }

  init() {
    super.init();

    this.groundPlane = this.createGroundPlane();
    this.controller = this.createController(this.scene);
  }

  update() {
    if (this.controller) {
      this.controller.update();
    }
  }

  dispose() {
    super.dispose();

    this.controller.dispose();
    this.controller = null;

    this.scene = null;
    this.size = null;
  }
}
