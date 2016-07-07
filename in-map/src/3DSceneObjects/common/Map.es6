import OrthographicCamera from 'in-map/src/3DSceneObjects/common/OrthographicCamera';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import {requestRendering} from 'in-map/src/stores/renderingStore';
import * as time from 'in-map/src/timeCalculations';
import eventBus from 'in-map/src/eventbus';


export default class Map extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
    this.groups = [];

    this.init();

    this.camera = new OrthographicCamera({ scene: parent });
    this.controller = this.getController(parent.canvas);
    this.groundPlane = this.getGroundPlane();

    this.registerEvents();
  }

  getGroundPlane() { throw new Error('PLEASE OVERRIDE METHOD'); }
  getController() { throw new Error('PLEASE OVERRIDE METHOD'); }
  init() { throw new Error('PLEASE OVERRIDE METHOD'); }

  initComponents() {
    // setup the factories before any component has a chance to run into undefined factory
    this.factories = {};
    this.setupFactories();

    super.initComponents();
  }

  getFactory(name) {
    return this.factories[name];
  }

  getFactories() {
    return Object.keys(this.factories).map(key => this.factories[key]);
  }

  handleTimeEvent() {
    // if the flag was set to recalculate the layouting
    if (this.refreshLayout) {
      this.applyLayout();
      eventBus.emit('layoutChanged');

      requestRendering();
      this.refreshLayout = false;
    }

    this.getFactories().forEach(factory => factory.rebuild());
  }

  registerEvents() {
    this.addSubscription(time.addTimeEventListener(this.handleTimeEvent.bind(this)));
  }

  update() {
    if (this.controller) {
      this.controller.update();
    }
  }

  layoutNeedsUpdate() {
    this.refreshLayout = true;
  }

  onZoom(zoomLevel) {
    if (this.groundPlane) {
      this.groundPlane.onZoom(zoomLevel);
    }
  }

  findNodeById(id) {
    const allNodes = this.getAllNodes(this);
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      if (node.id === id) {
        return node;
      }
    }
  }

  dispose() {
    this.refreshLayout = false;

    // disposing all subscriptions, so that no update is fired anymore
    super.dispose();

    // destory all known and unknown nodes
    this.getAllNodes(this).slice().forEach(node => node.dispose());

    this.controller.dispose();
    this.controller = null;

    this.camera.dispose();
    this.camera = null;

    this.groundPlane.dispose();
    this.groundPlane = null;

    this.getFactories().forEach(factory => factory.dispose());

    this.refreshLayout = null;
    this.parent = null;
    this.size = null;
  }
}
