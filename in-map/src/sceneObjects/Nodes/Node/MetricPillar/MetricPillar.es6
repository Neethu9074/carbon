import THREE from 'three';

import eventBus from 'in-services/eventbus';

import CollisionComponent from '../../../../components/CollisionObjectComponent';

import {cubeGeometry, defaultGeometryMaterial} from '../../../geometries';
import {currentTooltip} from '../../../../stores/mapStore';
import SceneObject from '../../../SceneObject/index';
import TooltipMetric from '../../../Tooltips/Metric';

let id = 0;


export default class MetricPillar extends SceneObject {

  constructor({parent}) {
    super({parent, id: id++});

    this.addSubscription(eventBus.on('upateMetricHeights')
      .throttle(1000)
      .subscribe(() => {
      if(this.isActive()) {
        this.updateMetricHeight();
      }
    }));

    this.tooltip = new TooltipMetric(parent);

    this.stateMachine.changeStateProperty('active', false);
  }

  initComponents() {
    super.initComponents();
    this.components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });
  }

  onHighlightEnter() {
    currentTooltip.emit(this.tooltip);
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
    this.getComponent('collision').stateMachine.changeStateProperty('active', true);
  }

  hidePillar() {
    this.removeFromMetricFactory();
    this.getComponent('collision').stateMachine.changeStateProperty('active', false);
  }

  addToMetricFactory() { throw new Error('NOT IMPLEMENTED'); }
  removeFromMetricFactory() { throw new Error('NOT IMPLEMENTED'); }
  setMetricValue() { throw new Error('NOT IMPLEMENTED'); }
  getFragment() { throw new Error('NOT IMPLEMENTED'); }

  updateMetricCollisionObject(newHeight) {
    this.getComponent('collision').sizeChanged(1, newHeight < 0.001 ? 0.001 : newHeight, 1);
  }

  updateMetricHeight() {
    const frag = this.scene.multiMetricFactory.getFragment(this.id);
    if(this.isHidden() || !frag) {return; }

    const tiles = frag.tiles;
    let values = [];

    //if there are no new metric values available
    const useOldPos = (this.newMetricValues === undefined);
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
    this.getComponent('collision').positionChanged(x, y, z);

    if(this.isActive()) {
      this.removeFromMetricFactory();
      this.addToMetricFactory();
    }
  }

  dispose() {
    super.dispose();

    this.removeFromMetricFactory();
  }
}
