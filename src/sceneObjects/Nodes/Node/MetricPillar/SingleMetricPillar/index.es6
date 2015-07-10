'use strict';

import THREE from 'three';

import SceneObject from '../../../../SceneObject/index';
import {cubeGeometry} from '../../../../geometries';
import TooltipMetric from '../../../../Tooltips/Metric';

import eventBus from 'instana-ui-services/eventbus';

let id = 0;


export default class SingleMetricPillar extends SceneObject {

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

  onHighlightEnter() {
    this.tooltip = new TooltipMetric(this.parent);
  }

  onHighlightLeave() {
    this.tooltip.dispose();
    this.tooltip = undefined;
  }

  onInactiveEnter() {
    this.scene.removeCollisionObject(this.metricCube, 2);
    this.removeFromSingleMetricFactory();
  }

  onInactiveLeave() {
    this.addToSingleMetricFactory();
    this.scene.addCollisionObject(this.metricCube, 2);
  }


  onHighlight(highlighted) {
    this.changeStateProperty('mouseOver', highlighted);
  }

  //for the single metric pillar
  addToSingleMetricFactory() {
    const pos = this.getPosition();
    const dim = this.metricCube.scale;

    this.scene.singleMetricFactory.addFragment({
      id: this.id, pos, dim, newHeight: 0
    });
  }

  removeFromSingleMetricFactory() {
    this.scene.singleMetricFactory.removeFragment(this.id);
  }

  createMetricCollisionObject() {
    let cube;
    this.metricCube = cube = new THREE.Mesh(cubeGeometry);
    cube.matrixAutoUpdate = false;
    cube.rotationAutoUpdate = false;
    cube.position.copy(this.getPosition());
    cube.updateMatrix();
    cube.updateMatrixWorld();
    cube.parentSceneObject = this;
  }

  setSingleMetricValue(value) {
    const fragment = this.scene.singleMetricFactory.getFragment(this.id);
    if(fragment) {
      fragment.newHeight = 1;

      //scale the collision cube to the max pillar size
      this.updateMetricCollisionObject(value);
    }
  }

  updateMetricCollisionObject(newHeight) {
    const cube = this.metricCube;
    const cubeHeight = newHeight * this.parent.height;
    cube.scale.y = cubeHeight < 0.001 ? 0.001 : cubeHeight;
    cube.updateMatrix();
    cube.updateMatrixWorld();
  }

  updateMetricHeight() {
    const frag = this.scene.multiMetricFactory.getFragment(this.id);
    if(this.hidden || !frag) {return; }

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
      this.scene.removeCollisionObject(cube, 2);
      this.scene.addCollisionObject(cube, 2);

      this.removeFromSingleMetricFactory();
      this.addToSingleMetricFactory();
    }
  }

  dispose() {
    this.disposeSubscriptions();

    this.removeCollisionObject(this.metricCube, 2);
    this.removeFromSingleMetricFactory();

    super.dispose();
  }
}
