'use strict';

import THREE from 'three';

import SceneObject from '../../../SceneObject/index';
import {cubeGeometry, defaultGeometryMaterial} from '../../../geometries';

import eventBus from 'in-services/eventbus';

let id = 0;


export default class MetricPillar extends SceneObject {

  constructor({parent}) {
    super({parent, id: id++});

    this.createMetricCollisionObject();

    this.addSubscription(eventBus.on('upateMetricHeights')
      .throttle(1000)
      .subscribe(() => {
      if(this.isActive()) {
        this.updateMetricHeight();
      }
    }));

    this.changeStateProperty('active', false);
  }

  onInactiveEnter() {
    this.hidePillar();
  }

  onInactiveLeave() {
    this.showPillar();
  }

  onHiddenEnter() {
    this.hidePillar();
  }

  onHiddenLeave() {
    this.showPillar();
  }

  showPillar() {
    this.addToMetricFactory();
    this.metricCube.isEnabled = true;
  }

  hidePillar() {
    this.metricCube.isEnabled = false;
    this.removeFromMetricFactory();
  }

  addToMetricFactory() { throw new Error('NOT IMPLEMENTED'); }
  removeFromMetricFactory() { throw new Error('NOT IMPLEMENTED'); }
  setMetricValue() { throw new Error('NOT IMPLEMENTED'); }
  getFragment() { throw new Error('NOT IMPLEMENTED'); }

  createMetricCollisionObject() {
    let cube;
    this.metricCube = cube = new THREE.Mesh(cubeGeometry, defaultGeometryMaterial);
    cube.matrixAutoUpdate = false;
    cube.rotationAutoUpdate = false;
    cube.isEnabled = false;
    cube.updateMatrix();
    cube.updateMatrixWorld();
    cube.parentSceneObject = this.parent;

    this.scene.addCollisionObject(cube, 2);
  }

  updateMetricCollisionObject(newHeight) {
    const cube = this.metricCube;
    cube.scale.y = newHeight < 0.001 ? 0.001 : newHeight;
    cube.updateMatrix();
    cube.updateMatrixWorld();
  }

  updateMetricHeight() {
    const frag = this.scene.multiMetricFactory.getFragment(this.id);
    if(this.isHidden() || !frag) {return; }

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

  positionChanged(x, y, z) {
    this.metricCube.position.copy({x, y, z});

    if(this.isActive()) {
      this.removeFromMetricFactory();
      this.addToMetricFactory();
    }
  }

  dispose() {
    super.dispose();

    this.metricCube.isEnabled = false;
    this.removeCollisionObject(this.metricCube, 2);
    this.removeFromMetricFactory();
  }
}
