'use strict';

import {createLogger} from 'instalog';
const logger = createLogger('ui-services.connection');

import THREE from 'three';
import React from 'react';
import _ from 'lodash';
import MetricServer from '../../MetricServer';

import {getHealth} from 'instana-ui-services/health';
import {create} from 'instana-ui-services/conveyer';
import {isIdEqual, getIdString} from 'instana-ui-services/util/snapshots';

import ConnectionGrid from '../../connectionGrid';
import Connection from '../Connection';
import SceneObject from '../SceneObject';
import StickyNote from './StickyNote';
import Process from '../Process/Process';

//const stickyNoteLineEndLocalPosition = new THREE.Vector3(0.5, 0.8, 0);
const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
const cubeHullThickness = new THREE.Vector3(0, 0.1, 0);
const groundPosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundScale = new THREE.Vector3(0.67, 0, 0.67);
const niceLookingDistanceForSticky = new THREE.Vector3(0, 0.8, 0.54);

//the basic geometry is a uniformed cube, where the pivot point is at the corner
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
for (let i = 0; i < cubeGeometry.vertices.length; i++) {
  cubeGeometry.vertices[i].x -= 0.5;
  cubeGeometry.vertices[i].y += 0.5;
  cubeGeometry.vertices[i].z += 0.5;
}
const cubeMaterial = new THREE.MeshBasicMaterial({visible: true});


export default class Host extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.scene = this.getScene();
    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.health = getHealth(snapshot);

    this.render();
    this.addStickyNote();
    this.registerEvents();

    this.processes = [];
    this.connections = [];

    this.show();
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.matrixAutoUpdate = false;

    //set this flag to add this obj to octree and not to scene!
    this.cube.useOnlyForCollisionDetection = true;
    this.cube.parentSceneObject = this;

    this.addSceneObject(this.cube);
    this.addToGlobalGeometry();
  }

  addToGlobalGeometry() {
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.addToHostFactory(id, pos, dim);
    this.addToZoneFactory(id, pos, dim);
    //this.addToLineFactory(id, pos, dim);
    this.addToMultiMetricFactory(id, pos, dim);
    this.addToSingleMetricFactory(id, pos, dim);
  }

  //adds the cube geometry
  addToHostFactory(id, pos, dim) {
    //add fragment to global geometry
    this.scene.hostFactory.addFragment({id, pos,
      dim: dim.clone().add(cubeHullThickness),
      health: this.health
    });
  }

  //for the multi metric pillars
  addToMultiMetricFactory(id, pos, dim) {
    const tiles = [];
    for (let i = 0; i < this.scene.numTiles; i++) {
      tiles[i] = {
        old: {from: 0, to: 0},
        new: {from: 0, to: 0}
      };
    }
    const fragment = {id, pos, dim, tiles};

    this.scene.multiMetricFactory.addFragment(fragment);
  }

  //for the single metric pillar
  addToSingleMetricFactory(id, pos, dim) {
    this.scene.singleMetricFactory.addFragment({
      id, pos, dim,
      newHeight: 0
    });
  }

  //not the zone where hosts are!
  //it's the ground zone of each host for the health
  addToZoneFactory(id, pos, dim) {
    this.scene.zoneFactory.addFragment({
      id,
      pos: this.cube.position.clone().add(groundPosition),
      dim: dim.clone().add(groundScale),
      health: this.health
    });
  }

  //this is the visual line between the cube top surface and the sticky note
  addToLineFactory(id, pos, dim) {
    const lineFactory = this.scene.lineFactory;
    const from = this.cube.position.clone()
      .add(new THREE.Vector3(-0.5, dim.y, 0.5));
    const to = from.clone()
      .add(niceLookingDistanceForSticky);

    lineFactory.addFragment({id, points: [from, to]});
  }

  addStickyNote() {
    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainerStyle = this.stickyNoteContainer.style;
    this.stickyNoteContainer.classList.add('in-sticky-note');
    this.getHtmlContainer().appendChild(this.stickyNoteContainer);

    this.stickyNoteEndPosWorld = new THREE.Vector3();
    this.calcStickyNodeWorldPos();
    this.renderStickyNote();
  }

  calcStickyNodeWorldPos() {
    const cube = this.cube;
    const worldPos = this.stickyNoteEndPosWorld;
    worldPos.set(-0.5, 0, 0.5);
    worldPos.applyMatrix4(cube.matrixWorld);

    // worldPos.x -= stickyNoteLineEndLocalPosition.x;
    worldPos.y = cube.scale.y; //+ stickyNoteLineEndLocalPosition.y;
    //worldPos.z += niceLookingDistanceForSticky.z + 0.5;
  }

  renderStickyNote() {
    React.render(
      <StickyNote snapshot={this.snapshot} />,
      this.stickyNoteContainer
    );
  }

  registerEvents() {
    this.addEE3Subscription({
      event: 'endUpdate',
      fn: this.update.bind(this)
    });

    this.addEE3Subscription({
      event: 'upateMetricHeights',
      fn: this.updateMetricHeight.bind(this)
    });

    this.metricServer = new MetricServer(this);
  }

  showMetrics() {
    //changing the material means changing the material for all processes
    this.getScene().cubeFactory.material.visible = false;
  }

  hideMetrics() {
    //changing the material means changing the material for all processes
    this.getScene().cubeFactory.material.visible = true;
  }

  setSingleMetricValue(value) {
    this.scene.singleMetricFactory
      .getFragment(this.id)
      .newHeight = value;
  }

  setMultiMetricValue(values) {
    this.newMetricValues = values;
  }

  updateMetricHeight() {
    const frag = this.scene.multiMetricFactory.getFragment(this.id);
    const tiles = frag.tiles;
    let values = [];
    let useOldPos = this.newMetricValues === undefined;

    if(!useOldPos) {
      values = this.newMetricValues;
      this.newMetricValues = undefined;
    } else {
      values = tiles.map((t) => { return t.new.to; });
    }

    tiles[0] = {
      old: {from: tiles[0].new.from, to: tiles[0].new.to},
      new: {from: 0, to: values[0]}
    };
    for (let i = 1; i < values.length; i++) {
      tiles[i] = {
        old: {from: tiles[i].new.from, to: tiles[i].new.to},
        new: {from: tiles[i - 1].new.to,
          to: useOldPos ? values[i] : tiles[i - 1].new.to + values[i]}
      };
    }
  }

  update(data) {
    if(!data.scene.renderHtmlStuff) {
      return;
    }

    //if the host is near enough or is in the view frustum
    if(!data.scene.objectIsVisible(this.cube)) {
      //disable sticky note
      if(this.stickyNoteContainerStyle.display !== 'none') {
        this.stickyNoteContainerStyle.display = 'none';
      }
    } else {
      this.updateStickyNotePosition(data);
      this.processes.forEach(process => process.updateStickyNotePosition());
    }
  }

  updateStickyNotePosition(data) {
    const scene = data.scene;
    const pos = this.stickyNoteEndPosWorld.clone();
    pos.applyMatrix4(scene.camera.projection);

    const x = ((pos.x + 1) * scene.width / 2) | 0;
    const y = ((-pos.y + 1) * scene.height / 2) | 0;

    const translate = `translate3d(${x}px,${y}px,0)`;
    this.stickyNoteContainerStyle.transform = translate;
    this.stickyNoteContainerStyle['-webkit-transform'] = translate;

    //set to '' because the display is set by zoom too. If you would set
    //this value to another like '' you would overwrite it
    this.stickyNoteContainerStyle.display = '';
  }

  onSnapshotUpdate(snapshot) {
    //if the reference is equal, don't update. the reference is always equal
    //on the same snapshots because they are immutable
    if(this.snapshot === snapshot) {
      return;
    }

    this.snapshot = snapshot;
    this.setHealth(getHealth(snapshot));
    this.renderStickyNote();
  }

  setPosition(x, y, z) {
    const pos = this.getPosition();
    if(pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    super.setPosition(x, y, z);
    this.cube.position.set(x, y, z);

    this.refreshMesh();
    this.refreshConnections();

    _.forEach(this.processes, p => p.setPosition(x, p.getPosition().y, z));
  }

  setHeight(height) {
    if(height === this.cube.scale.y) {
      return;
    }

    this.cube.scale.y = height;

    this.refreshMesh();
    this.arrangeProcesses();
  }

  setHealth(health) {
    if(health === this.health) {
      return;
    }
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.health = health;
    this.changeColorInFactory(id, health, this.scene.hostFactory);

    this.scene.zoneFactory.removeFragment(id);
    this.addToZoneFactory(id, pos, dim);
  }

  changeColorInFactory(id, health, factory) {
    const fragment = factory.getFragment(this.id);
    fragment.health = health;

    factory.changeColorOfFragment(fragment,
      factory.getColorArrayForFragment(fragment));
  }

  refreshMesh() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.calcStickyNodeWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  addProcess(snapshot) {
    //if this process is still there
    if(this.processes.indexOf(process => {
      return process.snapshot === snapshot;
    }) >= 0) {
      return;
    }

    const process = new Process({parent: this, snapshot});
    process.setLayerIndex(this.processes.length);
    this.processes.push(process);

    this.arrangeProcesses();

    logger.debug('create process', process.id);
  }

  //connects this host with another one. the connection is stored in a
  //connections collection
  connectWith(otherHost) {
    //don't setup a new connection if it's still available
    if(this.connections.indexOf(otherHost) >= 0) {
      return;
    }

    this.addConnection(new Connection({
      parent: this,
      from: this,
      to: otherHost
    }));
  }

  //is called from Connection class when creating a new connection
  addConnection(connection) {
    this.connections.push(connection);
  }

  //takes all connections and dispose them because the position of the host
  //has changed then calculates the new routes to the other Hosts
  refreshConnections() {
    this.connections.forEach(connection => {
      connection.refresh();
    });
  }

  arrangeProcesses() {
    const numOfProcesses = this.processes.length;
    const parentHeight = this.cube.scale.y;
    const heightOfEachProcess = parentHeight / numOfProcesses;
    let index = 0;

    _.forEach(this.processes, p => {
      const pos = p.getPosition();
      p.setPosition(pos.x, index++ * heightOfEachProcess, pos.z);
      p.setHeight(heightOfEachProcess);
    });
  }

  show() {
    super.show();

    const id = this.id;
    const scene = this.scene;

    scene.hostFactory.enableFragment(id);
    //scene.lineFactory.enableFragment(id);
    scene.zoneFactory.enableFragment(id);
    scene.multiMetricFactory.enableFragment(id);
    scene.singleMetricFactory.enableFragment(id);
  }

  hide() {
    super.hide();

    const id = this.id;
    const scene = this.scene;

    scene.hostFactory.disableFragment(id);
    //scene.lineFactory.disableFragment(id);
    scene.zoneFactory.disableFragment(id);
    scene.multiMetricFactory.disableFragment(id);
    scene.singleMetricFactory.disableFragment(id);
  }

  removeFromGlobalGeometry() {
    const id = this.id;
    const scene = this.scene;
    scene.hostFactory.removeFragment(id);
    //scene.lineFactory.removeFragment(id);
    scene.zoneFactory.removeFragment(id);
    scene.multiMetricFactory.removeFragment(id);
    scene.singleMetricFactory.removeFragment(id);
  }

  clearConnections() {
    this.connections.forEach(c => c.dispose());
    this.connections = [];
  }

  removeConnection(connection) {
    _.remove(this.connections, con => con === connection);
  }

  dispose() {
    this.clearConnections();

    _.forEach(this.processes, p => p.dispose());
    this.processes = [];

    this.removeSceneObject(this.cube);
    this.removeFromGlobalGeometry();
    this.cube = null;

    super.dispose();

    React.unmountComponentAtNode(this.stickyNoteContainer);
    this.stickyNoteContainer.parentNode.removeChild(this.stickyNoteContainer);
    this.stickyNoteEndPosWorld = null;

    this.scene = null;
    this.id = null;
    this.snapshot = null;
    this.health = null;
  }
}
