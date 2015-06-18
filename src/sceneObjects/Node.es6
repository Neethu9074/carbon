'use strict';

import THREE from 'three';

import {theme} from 'instana-ui-services/theme';
import {getPower} from 'instana-ui-sdk/power';
import {health} from 'instana-ui-services/health';
import eventBus from 'instana-ui-services/eventbus';

import BaseNode from './BaseNode';
import Layer from './Layer';
import NodeSnapshotServer from '../NodeSnapshotServer';
import StickyNoteNodeHighlight from './StickyNote/NodeHighlight';
import StickyNoteNode from './StickyNote/Node';
import StickyNoteLayer from './StickyNote/Layer';
import StickyNoteMetric from './StickyNote/Metric';

/*eslint-disable max-len*/
import PCP from '../SingleMeshFactory/ContentProvider/PlaneContentProvider';
import PCM from '../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import SCM from '../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
/*eslint-enable max-len*/

const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
let incrementId = 0;


export default class Node extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.incrementId = ++incrementId;
    this.stickyNote = new StickyNoteNode(this);

    this.health = this.health || health.ok;
    this.layer = [];
  }

  registerEvents() {
    super.registerEvents();

    this.snapshotServer = new NodeSnapshotServer(this);
  }

  addToGlobalGeometry() {
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.addToGroundFactory(id, pos, dim);
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
  addToGroundFactory(id, pos, dim) {
    if(!this.health || this.health === health.ok) {
      this.scene.groundSingleMeshFactory.removeFragment(id);
      return;
    }

    //adding a existing fragment will penetrate an update
    const color = this.calculateNodeColor();
    const position = pos;
    const scale = dim.clone().multiplyScalar(1.5);
    this.scene.groundSingleMeshFactory.addFragment({
      id: id,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new PCP(),
            x: scale.x, y: 1, z: scale.z
          }),
          x: position.x, y: position.y, z: position.z
        }),
        r: color.r, g: color.g, b: color.b
      })
    });
  }

  createStickyNoteHighlight() {
    return new StickyNoteNodeHighlight(this);
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

  collectConnections() {
    return this.getCurrentConnections().get(this.snapshot);
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
    const position = this.getPosition();
    if(x === position.x && y === position.y && z === position.z) {
      return;
    }

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
    this.refreshFragment();
  }

  setHealth(newHealth) {
    if(newHealth === this.health) {
      return;
    }

    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.health = newHealth;

    this.addToGroundFactory(id, pos, dim);
    this.refreshFragment();
  }

  changeColorInFactory(id, newHealth, factory) {
    const fragment = factory.getFragment(this.id);
    fragment.health = newHealth;

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

  enableFragments(enabled) {
    super.enableFragments(enabled);

    const scene = this.scene;
    const id = this.id;
    scene.multiMetricFactory.enableFragment(id, enabled);
    scene.singleMetricFactory.enableFragment(id, enabled);

    if(enabled) {
      this.addToGroundFactory();
    } else {
      this.scene.groundSingleMeshFactory.removeFragment(this.id);
    }
  }

  removeFromGlobalGeometry() {
    const id = this.id;
    const scene = this.scene;
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
    this.scene.groundSingleMeshFactory.removeFragment(this.id);

    super.dispose();

    this.snapshot = null;
    this.health = null;
  }

  calculateNodeColor() {
    const hostHealth = this.health;
    let color;
    if(hostHealth === health.warning) {
      color = new THREE.Color(theme.map.colors.warning);
    } else if(hostHealth === health.danger) {
      color = new THREE.Color(theme.map.colors.critical);
    } else {
      color = new THREE.Color(theme.map.colors.default);
    }
    return {r: color.r, g: color.g, b: color.b};
  }

  calculatePower() {
    try {
      return getPower(this.snapshot);
    } catch (err) {
      return super.calculatePower();
    }
  }
}
