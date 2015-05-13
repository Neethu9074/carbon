'use strict';

import THREE from 'three';
import React from 'react';
import _ from 'lodash';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import {getHealth} from 'instana-ui-sdk/health';
import {getMaxValue} from 'instana-ui-sdk/metrics';
import {isIdEqual, getIdString} from 'instana-ui-services/util/snapshots';
import eventBus from 'instana-ui-services/eventbus';

import SceneObject from './SceneObject';
import colors from '../colors';
import StickyNote from './StickyNote';
import Process from './Process';

const stickyNoteLineEndLocalPosition = new THREE.Vector3(0.5, 0.8, 0);
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

    if(window.location.search.match(/processes/)) {
      this.addProcesses(snapshot);
    }
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.matrixAutoUpdate = false;

    //set this flag to add this obj to octree and not to scene!
    this.cube.useOnlyForCollisionDetection = true;

    this.addSceneObject(this.cube);
    this.addToGlobalGeometry();
  }

  addToGlobalGeometry() {
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    //add fragment to global geometry
    this.scene.hostFactory.addFragment({id, pos,
      dim: dim.clone().add(cubeHullThickness),
      health: this.health
    });

    const tiles = [];
    for (let i = 0; i < this.scene.numTiles; i++) {
      tiles[i] = {
        old: {from: 0, to: 0},
        new: {from: 0, to: 0}
      };
    }
    const fragment = {id, pos, dim, tiles};

    this.scene.multiMetricFactory.addFragment(fragment);
    this.scene.singleMetricFactory.addFragment({id, pos, dim});

    this.scene.zoneFactory.addFragment({
      id,
      pos: this.cube.position.clone().add(groundPosition),
      dim: dim.clone().add(groundScale),
      health: this.health
    });

    const lineFactory = this.scene.lineFactory;
    const from = this.cube.position.clone()
      .add(new THREE.Vector3(-0.5, dim.y, 0.5));
    const to = from.clone()
      .add(niceLookingDistanceForSticky);

    lineFactory.addFragment({id, from, to});
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
    const worldPos = this.stickyNoteEndPosWorld;
    worldPos.set(0, 0, 0);
    worldPos.applyMatrix4(this.cube.matrixWorld);

    worldPos.x -= stickyNoteLineEndLocalPosition.x;
    worldPos.y = this.cube.scale.y + stickyNoteLineEndLocalPosition.y;
    worldPos.z += niceLookingDistanceForSticky.z + 0.5;
  }

  renderStickyNote() {
    React.render(
      <StickyNote snapshot={this.snapshot} />,
      this.stickyNoteContainer
    );
  }

  registerEvents() {
    this.addSubscription({
      event: 'endUpdate',
      fn: this.update.bind(this)
    });

    eventBus.on('showMetrics').subscribe(e => this.showMetrics(e.metrics));
  }

  showMetrics(metrics) {
    metrics.forEach(metric => {
      const max = getMaxValue(this.snapshot);
      const observable = create(MetricConveyer, {
        metric,
        frequency: 1000,
        snapshot: this.snapshot
      });
      this.addSubscription(observable.subscribe(
        value => this.setMetricValue(value / max)
      ));
    });
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
    this.snapshot = snapshot;
    this.setHealth(getHealth(snapshot));
    this.renderStickyNote();
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);
    this.cube.position.set(x, y, z);

    this.refreshMesh();

    _.forEach(this.processes, p => p.setPosition(x, p.getPosition().y, z));
  }

  setHeight(height) {
    this.cube.scale.y = height;

    this.refreshMesh();
    this.arrangeProcesses();
  }

  setHealth(health) {
    this.health = health;
    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  setMetricValue(value) {
    if(window.location.search.match(/multimetrics/)) {
      const frag = this.scene.multiMetricFactory.getFragment(this.id);
      this.createRandomMultiMetricValues(frag.tiles);
    } else {
      const frag2 = this.scene.singleMetricFactory.getFragment(this.id);
      frag2.dim.y = value;
    }
  }

  createRandomMultiMetricValues(tiles) {
    const rStart = Math.random();
    let total = rStart;
    tiles[0] = {
      old: {from: tiles[0].new.from, to: tiles[0].new.to},
      new: {from: 0, to: rStart}
    };
    for (let i = 1; i < this.scene.numTiles; i++) {
      const randomHeight = Math.random();
      total += randomHeight;
      tiles[i] = {
        old: {from: tiles[i].new.from, to: tiles[i].new.to},
        new: {from: tiles[i - 1].new.to, to: tiles[i - 1].new.to + randomHeight}
      };
    }

    for (let i = 0; i < tiles.length; i++) {
      tiles[i].new.from /= total;
      tiles[i].new.to /= total;
    }
  }

  refreshMesh() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.calcStickyNodeWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  addProcesses() {
    const numOfProcesses = Math.floor(Math.random() * 10);
    for (let i = 0; i < numOfProcesses; i++) {
      const process = new Process({parent: this});
      process.setLayerIndex(i);
      this.processes.push(process);
    }

    this.arrangeProcesses();
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

  removeFromGlobalGeometry() {
    const id = this.id;
    this.scene.hostFactory.removeFragment(id);
    this.scene.lineFactory.removeFragment(id);
    this.scene.zoneFactory.removeFragment(id);
    this.scene.multiMetricFactory.removeFragment(id);
    this.scene.singleMetricFactory.removeFragment(id);
  }

  dispose() {
    this.removeSceneObject(this.cube);
    this.removeFromGlobalGeometry();
    this.cube = null;

    this.parent.removeChild(this);

    React.unmountComponentAtNode(this.stickyNoteContainer);
    this.stickyNoteContainer.parentNode.removeChild(this.stickyNoteContainer);
    this.stickyNoteEndPosWorld = null;

    super.dispose();
    this.scene = null;
    this.id = null;
    this.snapshot = null;
    this.health = null;

    _.forEach(this.processes, p => p.dispose());
    this.processes = [];
  }
}
