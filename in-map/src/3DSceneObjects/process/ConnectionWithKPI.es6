import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/connection/KPI';
import ParticleEmitter from 'in-map/src/3DSceneObjects/common/ParticleEmitter';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Connection from 'in-map/src/3DSceneObjects/process/Connection';


const UP = new THREE.Vector3(0, 1, 0);

export default class ConnectionWithKPI extends Connection {

  constructor(params) {
    super(params);

    this.addSubscriptions([
      this.eventEmitter.on('screenPositionChanged_screenPosition').subscribe(screenPosition => {
        if (this.stickyNoteMetric) {
          this.stickyNoteMetric.setScreenPosition(screenPosition);
        }
      }),

      combineLatest([
        this.eventEmitter.on('isVisibleChanged_screenPosition').distinct(),
        this.parent.onZoomLevel()
      ]).subscribe(([isVisible, zoomLevel]) =>
        (isVisible && zoomLevel < 420) ?
          this.getOrCreateMetricSticky() :
          this.disposeMetricSticky()
      )
    ]);
  }

  init() {
    super.init();

    this.withArrows = true;

    this.particleEmitter = new ParticleEmitter({
      id: this.id + '__particleEmitter',
      parent: this
    });
  }

  getOrCreateMetricSticky() {
    if (!this.stickyNoteMetric) {
      this.stickyNoteMetric = new StickyNoteMetric(this);

      // force screen position update
      this.getComponent('screenPosition').updateScreenPosition(true);
    }
  }

  disposeMetricSticky() {
    if (this.stickyNoteMetric) {
      this.stickyNoteMetric.dispose();
      this.stickyNoteMetric = null;
    }
  }

  getFactory() {
    return this.parent.getFactory('connectionSMF');
  }

  getColor(color) {
    return color;
  }

  updateGeometry() {
    super.updateGeometry();

    const from = this.direction === DIRECTIONS.OUT ? this.sourceNode : this.destinationNode;
    const to = this.direction === DIRECTIONS.OUT ? this.destinationNode : this.sourceNode;
    const fromPos = from.getComponent('position').getPosition().clone();
    const toPos = to.getComponent('position').getPosition().clone();

    if (this.isBidirectional) {
      const direction = new THREE.Vector3(toPos.x - fromPos.x, 0, toPos.z - fromPos.z).normalize();
      const forward = direction.clone().multiplyScalar(0.075);
      const right = direction.cross(UP).multiplyScalar(0.25);
      fromPos.add(right);
      fromPos.sub(forward);
      toPos.add(right);
      toPos.add(forward);
    }

    this.particleEmitter.setFromAndTo(fromPos, toPos);
    this.particleEmitter.updateVertices();
  }

  dispose() {
    this.particleEmitter.dispose();
    this.particleEmitter = null;

    super.dispose();

    if (this.stickyNoteMetric) {
      this.stickyNoteMetric.dispose();
      this.stickyNoteMetric = null;
    }
  }
}
