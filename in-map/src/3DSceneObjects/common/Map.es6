import {remove, find} from 'lodash';

import OrthographicCamera from 'in-map/src/3DSceneObjects/common/OrthographicCamera';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import * as time from 'in-map/src/timeCalculations';
import {viewStructure} from 'in-stores/view';
import eventBus from 'in-map/eventbus';


export default class Map extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
    this.groups = [];

    this.init();
    this.registerEvents();

    this.camera = new OrthographicCamera({ scene: parent });
    this.controller = this.getController(parent.canvas);
    this.groundPlane = this.getGroundPlane();
  }

  getGroundPlane() { throw new Error('PLEASE OVERRIDE METHOD'); }
  getController() { throw new Error('PLEASE OVERRIDE METHOD'); }
  onZoom() { throw new Error('PLEASE OVERRIDE METHOD'); }
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

      this.scene.renderScene();
      this.refreshLayout = false;
    }

    this.getFactories().forEach(factory => factory.rebuild());
  }

  registerEvents() {
    // the problem here is a race condition. If the view changes, this logic will dispose the current
    // map and create a new one based on views type. This new map will subscribe to viewStructure and
    // get the cached structure which is the old one, because it wasn't updated yet. After the MapHandler was
    // told about the new view, the viewStructure will change but it is to late since the map already got
    // the old data. To avoid that, we need a debounce on viewStrcture subscription
    // this.addSubscription(viewStructure.debounce(500).subscribe(structures => this.onInventoryUpdate(structures)));
    this.addSubscription(viewStructure.subscribe(structures => this.onInventoryUpdate(structures)));
    this.addSubscription(time.addTimeEventListener(this.handleTimeEvent.bind(this)));
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

  onInventoryUpdated(inventory) {
    const allNodes = this.getAllNodes();

    // add connections later because all nodes need to be there
    inventory.forEach(entity => {
      const entityId = entity.get('id');
      const matchedNode = find(allNodes, n => n.id === entityId);

      if (matchedNode) {
        matchedNode.setChildren(entity.get('children'));

        const connectionsHandler = matchedNode.getComponent('connectionsHandler');
        connectionsHandler.setOutgoingConnections(entity.get('outgoingConnections'));
        connectionsHandler.setIncomingConnections(entity.get('incomingConnections'));
      }
    });

    this.layoutNeedsUpdate();
  }

  layoutNeedsUpdate() {
    this.refreshLayout = true;
  }

  // is called from group if it has no nodes anymore
  removeChild(child) {
    remove(this.groups, group => group.id === child.id);
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
