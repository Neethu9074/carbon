'use strict';

import THREE from 'three';
import React from 'react';
import _ from 'lodash';
import MetricServer from '../MetricServer';

import {getHealth} from 'instana-ui-services/health';
import {getPower} from 'instana-ui-sdk/power';
import {create} from 'instana-ui-services/conveyer';
import {isIdEqual, extractId, getIdString}
  from 'instana-ui-services/util/snapshots';
import eventBus from 'instana-ui-services/eventbus';

import ConnectionGrid from '../connectionGrid';
import Connection from './Connection';
import SceneObject from './SceneObject';
import StickyNoteHost from './StickyNote/Host';
import StickyNoteProcess from './StickyNote/Process';
import StickyNoteMetric from './StickyNote/Metric';
import Process from './Process';

const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
const cubeHullThickness = new THREE.Vector3(0, 0.01, 0);
const groundPosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundScale = new THREE.Vector3(0.67, 0, 0.67);

//the basic geometry is a uniformed cube, where the pivot point is at the corner
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
for (let i = 0; i < cubeGeometry.vertices.length; i++) {
  cubeGeometry.vertices[i].x -= 0.5;
  cubeGeometry.vertices[i].y += 0.5;
  cubeGeometry.vertices[i].z += 0.5;
}
//global cube material to reduce object creation
const cubeMaterial = new THREE.MeshBasicMaterial();

//if unavailable, the StickyNote-Metric / Process will not be undefined but this
//to avoid all these if(available) {do something} stuff
const emptyMetricStickyObject = {
  hide() {},
  update() {},
  updateWorldPos() {},
  render() {},
  dispose() {},
  show() {}
};


export default class Host extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.scene = parent.getScene();
    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.health = getHealth(snapshot);
    this.processes = [];
    this.connections = [];

    this.render();
    this.stickyNote = new StickyNoteHost(this);
    this.stickyNoteMetric = emptyMetricStickyObject;

    this.registerEvents();

    this.show();
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.matrixAutoUpdate = false;
    this.cube.rotationAutoUpdate = false;

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
    this.addToMultiMetricFactory(id, pos, dim);
    this.addToSingleMetricFactory(id, pos, dim);
  }

  //adds the cube geometry
  addToHostFactory(id, pos, dim) {
    this.scene.hostFactory.addFragment({
      id, pos,
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
      id, pos, dim, newHeight: 0
    });
  }

  //this is not the zone where hosts are on!
  //it's the health ground zone of each host
  addToZoneFactory(id, pos, dim) {
    this.scene.zoneFactory.addFragment({
      id,
      pos: this.cube.position.clone().add(groundPosition),
      dim: dim.clone().add(groundScale),
      health: this.health
    });
  }

  registerEvents() {
    this.addSubscription(eventBus.on('endUpdate').subscribe((data) =>
      this.update(data)));

    this.addSubscription(eventBus.on('upateMetricHeights').subscribe(() =>
      this.updateMetricHeight()));

    this.metricServer = new MetricServer(this);
  }

  showMetrics() {
    //changing the material means changing the material for all processes
    this.scene.cubeFactory.material.visible = false;

    // this.addStickyNoteForMetric();
  }

  hideMetrics() {
    //changing the material means changing the material for all processes
    this.scene.cubeFactory.material.visible = true;

    // this.stickyNoteMetric.dispose();
    // this.stickyNoteMetric = emptyMetricStickyObject;
  }

  setSingleMetricValue(value) {
    this.scene.singleMetricFactory
      .getFragment(this.id)
      .newHeight = value;

    // this.stickyNoteMetric.updateWorldPos();
    // this.stickyNoteMetric.render(value);
  }

  setMultiMetricValue(values) {
    this.newMetricValues = values;

    // this.stickyNoteMetric.updateWorldPos();
    // this.stickyNoteMetric.render();
  }

  updateMetricHeight() {
    const frag = this.scene.multiMetricFactory.getFragment(this.id);
    const tiles = frag.tiles;
    let values = [];

    //if there are no new metric values available
    let useOldPos = (this.newMetricValues === undefined);
    if(!useOldPos) {
      values = this.newMetricValues;
      this.newMetricValues = undefined;
    } else {
      //use the "old" to value as the new to value
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
      //trigger the hide method just once
      if(!this.hidden) {
        this.hideMetric();
        this.hidden = true;
      }
    } else {
      //trigger the show method just once
      if(this.hidden) {
        this.showMetric();
        this.hidden = false;
      }
      this.updateStickyNotes();
    }
  }

  hideMetric() {
    //disable sticky note
    this.stickyNote.hide();
    // this.stickyNoteMetric.hide();

    //disable metrics if the host isn't visible
    this.metricServer.pauseMetrics();
  }

  showMetric() {
    // if(this.stickyNoteMetric === emptyMetricStickyObject) {
    //   this.stickyNoteMetric = new StickyNoteMetric(this);
    // }

    //enable metrics if the host is visible but only if there is no "active"
    //hideMetrics event
    this.metricServer.resumeMetrics();
  }

  updateStickyNotes() {
    this.stickyNote.update();
    // this.stickyNoteMetric.update();
  }

  onSnapshotUpdate(snapshot) {
    //if the reference is equal, don't update. the reference is always equal
    //on the same snapshots because they are immutable
    if(this.snapshot === snapshot) {
      return;
    }

    this.snapshot = snapshot;
    this.setHealth(getHealth(snapshot));
    this.stickyNote.render();
  }

  setPosition(x, y, z) {
    const pos = this.getPosition();
    if(pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    super.setPosition(x, y, z);
    this.cube.position.set(x, y, z);

    this.refreshMesh();

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

    //can't change the color of the zone like the host does because
    //ok zones doesn't have a zone geometry!
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

    this.stickyNote.updateWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  addProcess(snapshot) {
    this.processes = this.processes ? this.processes : [];

    //if this process is still there
    if(this.processes.indexOf(process => {
      return (isIdEqual(snapshot, process.snapshot));
    }) >= 0) {
      return;
    }

    const process = new Process({parent: this, snapshot});
    process.setLayerIndex(this.processes.length);
    this.processes.push(process);

    this.arrangeProcesses();
    this.addStickyNoteForProcess();
  }

  //connects this host with another one. the connection is stored in a
  //connections collection
  connectWith(otherHost) {
    //don't setup a new connection if it's still alive
    if(this.connections.indexOf(otherHost) >= 0) {
      return;
    }

    /*eslint-disable no-new*/
    new Connection({parent: this, from: this, to: otherHost});
    /*eslint-enable no-new*/
  }

  //is called from Connection class when creating a new connection
  addConnection(connection) {
    this.connections.push(connection);
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

  addStickyNoteForProcess() {
    //only one sticky process sticky for each host
    if(this.stickyNoteProcess) {
      return;
    }

    this.stickyNoteProcess = new StickyNoteProcess(this);
  }

  addStickyNoteForMetric() {
    //only one sticky metric sticky for each host
    if(this.stickyNoteMetric !== emptyMetricStickyObject) {
      return;
    }

    this.stickyNoteMetric = new StickyNoteMetric(this);
  }

  show() {
    super.show();
    this.enableFragments(true);
  }

  hide() {
    super.hide();
    this.enableFragments(false);
  }

  enableFragments(enabled) {
    const scene = this.scene;
    const id = this.id;
    scene.hostFactory.enableFragment(id, enabled);
    scene.zoneFactory.enableFragment(id, enabled);
    scene.multiMetricFactory.enableFragment(id, enabled);
    scene.singleMetricFactory.enableFragment(id, enabled);
  }

  removeFromGlobalGeometry() {
    const id = this.id;
    const scene = this.scene;
    scene.hostFactory.removeFragment(id);
    scene.zoneFactory.removeFragment(id);
    scene.multiMetricFactory.removeFragment(id);
    scene.singleMetricFactory.removeFragment(id);
  }

  clearConnections() {
    this.connections.forEach(c => c.dispose());
    this.connections = [];
  }

  //is called from Connection class on disposing
  removeConnection(connection) {
    _.remove(this.connections, con => con === connection);
  }

  clearProcesses() {
    this.processes.forEach(p => p.dispose());
    this.processes = [];
  }

  dispose() {
    this.clearConnections();
    this.clearProcesses();

    this.removeFromGlobalGeometry();
    this.removeSceneObject(this.cube);
    this.cube = null;

    this.stickyNote.dispose();

    super.dispose();

    this.scene = null;
    this.id = null;
    this.snapshot = null;
    this.health = null;
  }

  calculatePower() {
    return getPower(this.snapshot);
  }
}
