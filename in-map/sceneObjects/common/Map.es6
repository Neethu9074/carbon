import SceneObject from 'in-map/sceneObjects/SceneObject';


export default class Map extends SceneObject {

  constructor(params) {
    super(params.id);

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
  }

  init() {
    super.init();

    this.controller = this.createController(parent.canvas);
    this.groundPlane = this.createGroundPlane();
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

    this.size = null;
  }
}
