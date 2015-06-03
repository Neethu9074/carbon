'use strict';

import THREE from 'three';

import {getPower} from 'instana-ui-sdk/power';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import {getHealth} from 'instana-ui-services/health';
import eventBus from 'instana-ui-services/eventbus';

import BaseHost from './BaseHost';
import Process from './Process';
import MetricServer from '../MetricServer';
import StickyNoteHost from './StickyNote/Host';
import StickyNoteProcess from './StickyNote/Process';
import StickyNoteMetric from './StickyNote/Metric';

const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundPosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundScale = new THREE.Vector3(0.67, 0, 0.67);

//if unavailable, the StickyNote-Metric / Process will not be undefined but this
//to avoid all these if(available) {do something} stuff
const emptyStickyObject = {
  hide() {},
  update() {},
  updateWorldPos() {},
  render() {},
  dispose() {},
  show() {}
};


export default class Host extends BaseHost {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.health = 'ok';
    this.processes = [];
    this.container = [];

    this.stickyNoteMetric = emptyStickyObject;
  }

  registerEvents() {
    super.registerEvents();

    this.addSubscription(eventBus.on('upateMetricHeights').subscribe(() =>
      this.updateMetricHeight()));

    this.addSubscription(getHealth(this.snapshot).subscribe(health =>
        this.setHealth(health)));

    this.metricServer = new MetricServer(this);
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

  createStickyNote() {
    return new StickyNoteHost(this);
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

    //if the host is near enough or is in the view frustum
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

    //disable metrics if the host isn't visible
    this.metricServer.pauseMetrics();
  }

  showMetric() {
    // if(this.stickyNoteMetric === emptyStickyObject) {
    //   this.stickyNoteMetric = new StickyNoteMetric(this);
    // }

    //enable metrics if the host is visible but only if there is no "active"
    //hideMetrics event
    this.metricServer.resumeMetrics();
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

    this.processes.forEach(p => p.setPosition(x, p.getPosition().y, z));
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

  addProcess(snapshot) {
    //dont create a process if its still there
    if(this.processes.indexOf(process => snapshot === process.snapshot) >= 0) {
      return;
    }

    const process = new Process({parent: this, snapshot});
    process.setLayerIndex(this.processes.length);
    this.processes.push(process);

    this.arrangeChildren();
    //this.addStickyNoteForProcess();
  }

  arrangeChildren() {
    const processes = this.processes;
    const container = this.container;
    const heightOfEachChild = this.cube.scale.y /
      (processes.length + container.length); //totalHeight(host) / #children

    let index = 0;

    processes
    .concat(container)
    .forEach(child => {
      const pos = child.getPosition();
      child.setPosition(pos.x, index++ * heightOfEachChild, pos.z);
      child.setHeight(heightOfEachChild);
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
    if(this.stickyNoteMetric !== emptyStickyObject) {
      return;
    }

    this.stickyNoteMetric = new StickyNoteMetric(this);
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

  clearProcesses() {
    this.processes.forEach(p => p.dispose());
    this.processes = [];
  }

  dispose() {
    this.clearProcesses();

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
