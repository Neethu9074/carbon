import _ from 'lodash';

import {viewStructure} from 'in-services/stores/view';
import eventBus from 'in-services/eventbus';
import {getPlural} from 'in-sdk/pluginName';
import * as views from 'in-services/views';
import {getIn} from 'in-services/settings';
import {getLabel} from 'in-sdk/snapshot';

import {getAllNodes, getAllGroups} from '../../mapStructureUtils';
import OrthographicCamera from '../OrthographicCamera';
import ConnectionGrid from '../../ConnectionGrid';
import * as time from '../../timeCalculations';
import * as stores from '../../mapStores';
import SceneObject from '../SceneObject';
import Layouter from '../../layout';
import Group from '../Group';


const nameOfUndefinedZone = 'undefined zone';

export default class VisualMap extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
    this.hideUnmonitoredHosts = false;
    this.groups = [];

    this.registerEvents();

    this.camera = new OrthographicCamera({ scene: parent });
    this.controller = this.getController(parent.canvas);
    this.groundPlane = this.getGroundPlane();
  }

  getGroundPlane() { throw new Error('NOT IMPLEMENTED'); }
  getController() { throw new Error('NOT IMPLEMENTED'); }
  onZoom() { throw new Error('NOT IMPLEMENTED'); }

  handleTimeEventFunction() {
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

    this.handleTimeEvent = this.handleTimeEventFunction.bind(this);
    time.addTimeEventListener({
      handleComponentTimeEvent: this.handleTimeEvent
    });

    // because this check is pretty expensive and will be replaced by a more hipper
    // backend technology soon, only do this if it's necessary
    this.addSubscription(eventBus.on('onViewSwitched').subscribe(() =>
      this.removeAllUnknownNodesWithoutConnections()
    ));

    this.addSubscription(getIn(['map', 'unmonitoredHosts']).subscribe(hideUnmonitoredHosts =>
      this.disableUnmonitoredHosts(hideUnmonitoredHosts)
    ));

    this.addSubscription(stores.selectedSceneObject.subscribe(event => {
      if (event.sceneObject && !event.calledByMap) {
        this.controller.flyToObject(event.sceneObject);
      }
    }));
  }

  update() {
    if (this.controller) {
      this.controller.update();
    }
  }

  disableUnmonitoredHosts(hide) {
    if (this.hideUnmonitoredHosts !== hide) {
      this.refreshLayout = true;
    }
    this.hideUnmonitoredHosts = hide;

    if (hide) {
      const unmonitoredGroup = this.getOrCreateGroup(undefined, 'unmonitored');
      if (unmonitoredGroup) {
        unmonitoredGroup.dispose();
      }
    }
  }

  onInventoryUpdate(structures) {
    structures.forEach(triple => this.addNode(triple));

    this.removeVanishedNodes(structures);
  }

  applyLayout() {
    let numElementsOnMap = 0;
    this.groups.forEach(group => {
      group.children.forEach(() => {
        numElementsOnMap++;
      });
    });

    const maxNodesPerRow = Math.floor(Math.sqrt(numElementsOnMap / this.groups.length));
    const layouter = new Layouter({maxNodesPerRow});
    layouter.applyLayout(this);
  }

  removeVanishedNodes(structures) {
    // identify removed nodes: nodes that are not inside the snapshot update
    getAllNodes(this).forEach(node => {
      if (node.isUnknown) {
        return;
      }
      const snapshotExistsInUpdate = structures.some(triple => triple.node.get('id') === node.id);
      if (!snapshotExistsInUpdate) {
        node.dispose();
      }
    });
  }

  removeAllUnknownNodesWithoutConnections() {
    getAllNodes(this).forEach(node => {
      if (!node.isUnknown) {
        return;
      }

      const wired = node.getWiredSnapshots();
      if (wired.incoming.length === 0 && wired.outgoing.length === 0) {
        node.dispose();
      }
    });
  }

  addNode(triple) {
    this.addNodeToGroup(triple, this.getGroupName(triple.group));
  }

  getGroupName(group) {
    return getLabel(group) || nameOfUndefinedZone;
  }

  addNodeToGroup(triple, groupId) {
    if ((!groupId || groupId === nameOfUndefinedZone) && this.view === views.process) {
      groupId = getPlural(triple.node.get('pluginId'));
    }
    const group = this.getOrCreateGroup(triple.group, groupId);

    if (triple.parentGroup) {
      const parentGroup = this.getOrCreateGroup(triple.parentGroup, this.getGroupName(triple.parentGroup));
      parentGroup.addGroup(group);

      _.remove(this.groups, g => g.id === group.id);
    }

    // add the node to group (the group handles duplicates)
    const newNode = group.addNode({
      connections: triple.connections,
      coordinates: triple.node,
      layer: triple.layers
    });

    if (!newNode) {
      return;
    }

    // if the group has switched delete the nodes in other groups than the current one
    this.removeNodeFromAllGroupsInsteadOf(groupId, newNode);
    this.refreshLayout = true;
  }

  getAllMapNodes() {
    return getAllNodes(this);
  }

  getOrCreateGroup(coordinates, id) {
    // get find the group with id
    let group = _.find(getAllGroups(this), g => g.id === id);

    // if the nodes group doesn't exist, create it
    if (!group) {
      group = new Group({id, parent: this, coordinates});
      this.groups.push(group);
    }

    return group;
  }

  // runs through all groups instead of the current one and searches for the
  // node added to the current one. if found -> delete it from old groups
  removeNodeFromAllGroupsInsteadOf(groupId, newNode) {
    const nodeId = newNode.id;
    getAllNodes(this).forEach(node => {
      if (node.id === nodeId && node.parent.id !== groupId) {
        node.dispose();
      }
    });
  }

  addUnknownNode(node) {
    if (this.hideUnmonitoredHosts) {
      return;
    }

    // create zone and send the event back
    this.getOrCreateGroup(undefined, 'unmonitored').addUnknownNode(node);

    this.refreshLayout = true;
  }

  showWalkableGrid() {
    if (this.particles) {
      this.removeSceneObject(this.particles);
    }
    this.particles = ConnectionGrid.asVisualObject();
    this.addSceneObject(this.particles);
  }

  // is called from group if it has no nodes anymore
  removeChild(child) {
    _.remove(this.groups, group => group.id === child.id);
  }

  findNodeById(id) {
    const allNodes = getAllNodes(this);
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

    time.removeTimeEventListener(this.handleTimeEvent);
    this.handleTimeEvent = null;

    // destory all known and unknown nodes
    getAllNodes(this).slice().forEach(node => node.dispose());

    this.controller.dispose();
    this.controller = null;

    this.camera.dispose();
    this.camera = null;

    this.groundPlane.dispose();
    this.groundPlane = null;

    // groups are disposing themselves if there is no cube inside anymore
    this.groups = [];

    this.parent = null;
    this.size = null;
  }
}
