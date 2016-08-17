import SceneObject from 'in-map/sceneObjects/SceneObject';
import {eventBus} from 'in-map/services/eventBus';


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

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      eventBus.on('update').subscribe(dt => this.controller.update(dt)),

      eventBus.on('focusPosition').subscribe(pos => {
        if (pos) {
          this.controller.flyToPosition(pos);
        }
        // clear stream data
        eventBus.emit('focusPosition', null);
      })
    ]);
  }

  centerMap() {
    this.controller.flyToPosition(this.layouter.getFocusPointFromCurrentDimensions());
  }

  dispose() {
    super.dispose();

    this.controller.dispose();
    this.controller = null;

    this.groundPlane.dispose();
    this.groundPlane = null;

    this.scene = null;
    this.size = null;
  }
}
