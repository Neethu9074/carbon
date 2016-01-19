import _ from 'lodash';

import {viewStructure} from 'in-stores/view';
import eventBus from 'in-services/eventbus';

import OrthographicCamera from '../OrthographicCamera';
import * as time from '../../timeCalculations';
import SceneObject from '../SceneObject';


export default class VisualMap extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
    this.hideUnmonitoredHosts = false;
    this.groups = [];

    this.init();
    this.registerEvents();

    this.camera = new OrthographicCamera({ scene: parent });
    this.controller = this.getController(parent.canvas);
    this.groundPlane = this.getGroundPlane();
  }

  getGroundPlane() { throw new Error('NOT IMPLEMENTED'); }
  getController() { throw new Error('NOT IMPLEMENTED'); }
  onZoom() { throw new Error('NOT IMPLEMENTED'); }
  init() { throw new Error('NOT IMPLEMENTED'); }

  handleComponentTimeEvent() {
    // if the flag was set to recalculate the layouting
    if (this.refreshLayout) {
      this.applyLayout();
      eventBus.emit('layoutChanged');

      this.scene.renderScene();
      this.refreshLayout = false;
    }
  }

  registerEvents() {
    this.addSubscription(viewStructure.subscribe(structures => this.onInventoryUpdate(structures)));
    this.addSubscription(time.addTimeEventListener(this.handleComponentTimeEvent.bind(this)));
  }

  update() {
    if (this.controller) {
      this.controller.update();
    }
  }

  onInventoryUpdate(rootNode) {
    const inventory = rootNode.get('children');

    inventory.forEach(entity => this.addEntity(entity));
    this.onInventoryUpdated(inventory);
  }

  // is called from group if it has no nodes anymore
  removeChild(child) {
    _.remove(this.groups, group => group.id === child.id);
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

  switchToAscii() {
    this.controller.dispose();
    this.controller = this.getController(this.scene.asciiEffect.domElement);
  }

  dispose() {
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

    this.parent = null;
    this.size = null;
  }
}
