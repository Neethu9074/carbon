'use strict';

import THREE from 'three';

import SceneObject from '../../../SceneObject/index';
import {cubeGeometry} from '../../../geometries';

import eventBus from 'in-services/eventbus';

let id = 0;


export default class MetricPillar extends SceneObject {

  constructor({parent}) {
    super({parent});

    this.id = id++;

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

  onInitialEnter() {}

  onInitialLeave() {}

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
    this.addCollisionObject(this.metricCube, 2);
  }

  hidePillar() {
    this.removeCollisionObject(this.metricCube, 2);
    this.removeFromMetricFactory();
  }

  addToMetricFactory() { throw new Error('NOT IMPLEMENTED'); }
  removeFromMetricFactory() { throw new Error('NOT IMPLEMENTED'); }
  setMetricValue() { throw new Error('NOT IMPLEMENTED'); }
  getFragment() { throw new Error('NOT IMPLEMENTED'); }

  createMetricCollisionObject() {
    let cube;
    this.metricCube = cube = new THREE.Mesh(cubeGeometry);
    cube.matrixAutoUpdate = false;
    cube.rotationAutoUpdate = false;
    cube.position.set(0, -10, 0);
    cube.updateMatrix();
    cube.updateMatrixWorld();
    cube.parentSceneObject = this.parent;
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

  updateOfVisualComponents(pos) {
    super.setPosition(pos.x - 0.5, pos.y, pos.z + 0.5);

    const cube = this.metricCube;
    cube.position.copy(pos);

    if(this.isActive()) {
      this.removeCollisionObject(cube, 2);
      this.addCollisionObject(cube, 2);

      this.removeFromMetricFactory();
      this.addToMetricFactory();
    }
  }

  dispose() {
    this.disposeSubscriptions();

    this.removeCollisionObject(this.metricCube, 2);
    this.removeFromMetricFactory();

    super.dispose();
  }
}
