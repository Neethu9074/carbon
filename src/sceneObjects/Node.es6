'use strict';

import THREE from 'three';

import {getPower} from 'instana-ui-sdk/power';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import {health} from 'instana-ui-services/health';
import eventBus from 'instana-ui-services/eventbus';

import BaseNode from './BaseNode';
import Layer from './Layer';
import NodeSnapshotServer from '../NodeSnapshotServer';
import StickyNoteNode from './StickyNote/Node';
import StickyNoteLayer from './StickyNote/Layer';
import StickyNoteMetric from './StickyNote/Metric';

const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundPosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundScale = new THREE.Vector3(0.67, 0, 0.67);

//if unavailable, the StickyNote-Metric / Layer will not be undefined but this
//to avoid all these if(available) {do something} stuff
const emptyStickyObject = {
  hide() {},
  update() {},
  updateWorldPos() {},
  render() {},
  dispose() {},
  show() {}
};


export default class Node extends BaseNode {

  constructor({parent, snapshot}) {
    this.health = health.ok;
    super({parent, snapshot});

    this.layer = [];

    this.stickyNoteMetric = emptyStickyObject;
  }

  registerEvents() {
    super.registerEvents();

    this.snapshotServer = new NodeSnapshotServer(this);
  }

  addToGlobalGeometry() {
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.addToNodeFactory(id, pos, dim);
    this.addToGroupFactory(id, pos, dim);
    this.addToMultiMetricFactory(id, pos, dim);
    this.addToSingleMetricFactory(id, pos, dim);
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

  //this is not the group where nodes are on!
  //it's the health ground group of each node
  addToGroupFactory(id, pos, dim) {
    if(!this.health) {
      return;
    }

    this.scene.groupFactory.addFragment({
      id,
      pos: this.cube.position.clone().add(groundPosition),
      dim: dim.clone().add(groundScale),
      health: this.health
    });
  }

  createStickyNote() {
    return new StickyNoteNode(this);
  }

  showMetrics() {
    // this.addStickyNoteForMetric();
  }

  hideMetrics() {
    // this.stickyNoteMetric.dispose();
    // this.stickyNoteMetric = emptyStickyObject;
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

    //if the node is near enough or is in the view frustum
    if(!data.scene.objectIsVisible(this.cube)) {
      //trigger the hide method just once
      if(!this.outsideViewFrustum) {
        this.hideMetric();
        this.outsideViewFrustum = true;
      }
    } else {
      //trigger the show method just once
      if(this.outsideViewFrustum) {
        this.showMetric();
        this.outsideViewFrustum = false;
      }
      this.updateStickyNotes();
    }
  }

  hideMetric() {
    //disable sticky note
    this.stickyNote.hide();
    // this.stickyNoteMetric.hide();

    //disable metrics if the node isn't visible
    this.snapshotServer.pauseMetrics();
  }

  showMetric() {
    // if(this.stickyNoteMetric === emptyStickyObject) {
    //   this.stickyNoteMetric = new StickyNoteMetric(this);
    // }

    //enable metrics if the node is visible but only if there is no "active"
    //hideMetrics event
    this.snapshotServer.resumeMetrics();
  }

  onSnapshotUpdate(snapshot) {
    //if the reference is equal, don't update. the reference is always equal
    //on the same snapshots because they are immutable
    if(this.snapshot === snapshot) {
      return;
    }

    this.snapshot = snapshot;
    this.stickyNote.render();
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);

    this.layer.forEach(p => p.setPosition(x, p.getPosition().y, z));
  }

  setHeight(height) {
    if(height === this.cube.scale.y) {
      return;
    }

    this.cube.scale.y = height;

    this.refreshMesh();
    this.arrangeChildren();
  }

  setHealth(health) {
    if(health === this.health) {
      return;
    }

    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.health = health;
    this.changeColorInFactory(id, health, this.scene.nodeFactory);

    //can't change the color of the group like the node does because
    //ok groups doesn't have a group geometry!
    this.scene.groupFactory.removeFragment(id);
    this.addToGroupFactory(id, pos, dim);
  }

  changeColorInFactory(id, health, factory) {
    const fragment = factory.getFragment(this.id);
    fragment.health = health;

    factory.changeColorOfFragment(fragment,
      factory.getColorArrayForFragment(fragment));
  }

  addLayer(snapshot) {
    //dont create a layer if its still there
    if(this.layer.indexOf(layer => snapshot === layer.snapshot) >= 0) {
      return;
    }

    const layer = new Layer({parent: this, snapshot});
    layer.setLayerIndex(this.layer.length);
    this.layer.push(layer);

    this.arrangeChildren();
    //this.addStickyNoteForLayer();
  }

  arrangeChildren() {
    const layer = this.layer;
    const heightOfEachChild = this.cube.scale.y / layer.length;

    let index = 0;

    layer.forEach(child => {
      const pos = child.getPosition();
      child.setPosition(pos.x, index++ * heightOfEachChild, pos.z);
      child.setHeight(heightOfEachChild);
    });
  }

  addStickyNoteForLayer() {
    //only one sticky layer sticky for each node
    if(this.stickyNoteLayer) {
      return;
    }

    this.stickyNoteLayer = new StickyNoteLayer(this);
  }

  addStickyNoteForMetric() {
    //only one sticky metric sticky for each node
    if(this.stickyNoteMetric !== emptyStickyObject) {
      return;
    }

    this.stickyNoteMetric = new StickyNoteMetric(this);
  }

  enableFragments(enabled) {
    const scene = this.scene;
    const id = this.id;
    scene.nodeFactory.enableFragment(id, enabled);
    scene.groupFactory.enableFragment(id, enabled);
    scene.multiMetricFactory.enableFragment(id, enabled);
    scene.singleMetricFactory.enableFragment(id, enabled);
  }

  removeFromGlobalGeometry() {
    const id = this.id;
    const scene = this.scene;
    scene.nodeFactory.removeFragment(id);
    scene.groupFactory.removeFragment(id);
    scene.multiMetricFactory.removeFragment(id);
    scene.singleMetricFactory.removeFragment(id);
  }

  clearLayer() {
    this.layer.forEach(p => p.dispose());
    this.layer = [];
  }

  dispose() {
    this.snapshotServer.dispose();
    this.clearLayer();

    super.dispose();

    this.snapshot = null;
    this.health = null;
  }

  calculatePower() {
    try {
      return getPower(this.snapshot);
    } catch (err) {
      return super.calculatePower();
    }
  }
}
