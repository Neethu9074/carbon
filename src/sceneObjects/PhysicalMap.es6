'use strict';

import THREE from 'three';

import _ from 'lodash';
import Immutable from 'immutable';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import ConnectionGrid from '../connectionGrid';
import {connections as allConnections} from './Connection';
import {getZone} from 'instana-ui-sdk/zones';
import {
  isIdEqual,
  getIdString,
  extractConnections} from 'instana-ui-services/util/snapshots';
import SceneObject from './SceneObject';
import groundTexturePath from './ground.png';
import Group from './Group';
import Layouter from '../layout';


export default class PhysicalMap extends SceneObject {

  constructor({scene}) {
    super({parent: scene});

    //the size of the map in world units
    this.size = 1000;

    this.scene = scene;
    this.groups = [];

    this.createGroundGrid();
    this.bindToDatasource();
  }

  createGroundGrid() {
    const geo = new THREE.PlaneBufferGeometry(this.size, this.size, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: this.getGroundTexture(),
      transparent: true,
      opacity: 0.1,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const ground = new THREE.Mesh(geo, mat);
    // turn the group around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
    ground.rotation.x = -90 * Math.PI / 180;
    ground.position.y = -0.02;

    //set static
    ground.matrixAutoUpdate = false;
    ground.rotationAutoUpdate = false;
    ground.updateMatrix();

    this.scene.addSceneObject(ground);
  }

  getGroundTexture() {
    const quadsPerWorldUnit = 3;
    const repating = quadsPerWorldUnit * this.size;
    const texture = THREE.ImageUtils.loadTexture(
      groundTexturePath,
      THREE.UVMapping,
      () => { this.scene.renderScene(); });

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repating, repating);

    //set the ground anisotropy to the max because it's a huge ground always
    //seen and it needs to be as sharp as possible
    texture.anisotropy = this.scene.renderer.getMaxAnisotropy();

    this.groundtexture = texture;
    return texture;
  }

  bindToDatasource() {
    const pluginId = 'com.instana.forge.infrastructure.os.OS';
    const observable = create(SnapshotConveyer, {pluginId});
    this.addSubscription(
      observable.subscribe(data => this.onInventoryUpdate(data)));
  }

  applyLayout() {
    let numElementsOnMap = 0;
    this.groups.forEach(group => {
      group.children.forEach(() => {
        numElementsOnMap++;
      });
    });

    const maxNodesPerRow = Math.floor(
      Math.sqrt(numElementsOnMap / this.groups.length));
    new Layouter({maxNodesPerRow}).applyLayout(this);
  }

  onInventoryUpdate(snapshots) {
    const unknownGroup = this.getOrCreateGroup('unmonitored');
    const connections = extractConnections(snapshots);
    snapshots.forEach(node => this.addNode(node, connections, unknownGroup));

    this.removeVanishedUnknownNodes(connections, unknownGroup);
    this.removeVanishedNodes(snapshots);

    //delete the unknownGroup if there are no nodes in it
    if(unknownGroup.length === 0) {
      unknownGroup.dispose();
    }

    this.applyLayout();
    this.setupConnections(snapshots, connections);
    this.showWalkableGrid(); //uncomment this to see the walking grid
    this.parent.renderScene();
  }

  removeVanishedNodes(snapshots) {
    // identify removed nodes: nodes that are not inside the snapshot update
    const removedNodes = this.groups
      //get all nodes from all groups
      .reduce((nodes, group) => {return nodes.concat(group.children); }, [])
      //only the monitored
      .filter(node => !node.isUnknown)
      //only the ones that are not in snapshots anymore
      .filter(node => {
        const foundSnapshot = snapshots.find(snapshot =>
          isIdEqual(snapshot, node.snapshot));
        return !foundSnapshot;
      });

    removedNodes.forEach((node) => node.dispose());
  }

  addNode(node, connections, unknownGroup) {
    const groupId = getZone(node);
    const group = this.getOrCreateGroup(groupId);

    //add the node to group (the group handles duplicates)
    group.addNode({snapshot: node});

    //if the group has switched,
    //delete the nodes in other groups than the current one
    this.removeNodeFromAllGroupsInsteadOf(groupId, node);

    const nodeConnections = connections.find((v, k) => k === node);
    if(nodeConnections) {
      this.createAllUnknownNodesFor(node, nodeConnections, unknownGroup);
    }
  }

  getOrCreateGroup(groupId) {
    //get find the group with groupId
    let group = _.find(this.groups, group => group.id === groupId);

    //if the nodes group doesn't exist, create it
    if (!group) {
      group = new Group({
        parent: this,
        id: groupId,
        groupIndex: this.groups.length
      });
      group.createLabel();
      this.groups.push(group);
    }

    return group;
  }

  //runs through all groups instead of the current one and searches for the
  //node added to the current one. if found -> delete it from old groups
  removeNodeFromAllGroupsInsteadOf(groupId, node) {
    this.groups.forEach(group =>{
      if(group.id !== groupId) {
        group.children.forEach(groupNode => {
          if(isIdEqual(node, groupNode.snapshot)) {
            groupNode.dispose();
          }
        });
      }
    });
  }

  createAllUnknownNodesFor(snapshot, connections, unknownGroup) {
    const allConnections = connections.outgoing.concat(connections.incoming);

    allConnections.forEach((connection) => {
      //only create nodes that are unmonitored by agent
      if(connection.get('state') === 'unmonitored') {
        unknownGroup.addNode({snapshot: connection, unknown: true});
      }
    });
  }

  removeVanishedUnknownNodes(connections, unknownGroup) {
    const allUnmonitoredNodes = unknownGroup.children;
    const allAvailableUnmonitoredNodes = [];

    connections.forEach((nodeCons) => {
      const allConnections = nodeCons.outgoing.concat(nodeCons.incoming);
      allConnections.forEach((connection) => {
        if(connection.get('state') === 'unmonitored') {
          allAvailableUnmonitoredNodes.push(connection);
        }
      });
    });

    //get all created nodes which are not inside all current nodes collection
    const removed = allUnmonitoredNodes
      .filter(node => {
        const match = _.find(allAvailableUnmonitoredNodes, available => {
          return isIdEqual(available, node.snapshot);
        });
        return !match;
      });

    //dispose all found nodes
    removed.forEach((node) => node.dispose());
  }

  showWalkableGrid() {
    if(this.particles) {
      this.removeSceneObject(this.particles);
    }
    this.particles = ConnectionGrid.asVisualObject();
    this.addSceneObject(this.particles);
  }

  //is called after an inventory update incoming. the prerequirement is
  //that all nodes are available to connect the objects
  setupConnections(snapshots, connections) {
    //clear all connections
    allConnections.slice().forEach(connection => connection.dispose());

    const idNodeMap = this.getIdNodeMap();

    connections.forEach((nodeCons, node) => {
      //if the from node is available
      const fromNode = idNodeMap[getIdString(node)];
      if(fromNode) {

        nodeCons.outgoing.forEach(connection => {
          //if the node has any connection
          if(connection) {
            //if to node is available
            const toNode = idNodeMap[getIdString(connection)];
            if(toNode) {
              fromNode.connectWith(toNode);
            }
          }
        });

        nodeCons.incoming.forEach(connection => {
          //if the node has any connection
          if(connection) {
            //if to node is available
            const toNode = idNodeMap[getIdString(connection)];
            if(toNode) {
              toNode.connectWith(fromNode);
            }
          }
        });
      }
    });
  }

  //creates an object<getIdString(node), node> to get fast access to it
  getIdNodeMap() {
    const map = {};

    this.groups.forEach(group => {
      group.children.forEach(node => {
        map[node.id] = node;
      });
    });

    return map;
  }

  filter(validationFunction) {
    const unMatched = this.groups
      //get all nodes from all groups
      .reduce((nodes, group) => {return nodes.concat(group.children); }, [])
      .filter(node => !validationFunction(node));

    unMatched.forEach((node) => node.hide());
  }

  //is called from group if it has no nodes anymore
  removeChild(child) {
    _.remove(this.groups, group => group.id === child.id);
  }

  onZoom(zoomLevel) {
    const size = this.size;
    if(zoomLevel < 120) {
      this.groundtexture.repeat.set(3 * size, 3 * size);
    } else {
      this.groundtexture.repeat.set(size, size);
    }
  }

  dispose() {
    super.dispose();

    this.removeSceneObject(this.ground);

    //clear three.js cache trough disposing
    this.ground.geometry.dispose();
    this.ground.material.dispose();
    this.ground = null;

    this.size = null;
    this.groups = [];
    this.scene = null;
    this.parent = null;
  }
}
