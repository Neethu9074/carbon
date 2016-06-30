import {combineLatest} from 'reactive-observables';

import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/connection/Metric';
import ParticleEmitter from 'in-map/src/3DSceneObjects/common/ParticleEmitter';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Connection from 'in-map/src/3DSceneObjects/process/Connection';
import {hexToRGBNormalized} from 'in-services/formatters/color';


export default class ConnectionWithKPI extends Connection {

  constructor(params) {
    super(params);

    this.withArrows = true;

    this.addSubscriptions([
      this.eventEmitter.on('screenPositionChanged_screenPosition').subscribe(screenPosition => {
        if (this.stickyNoteMetric) {
          this.stickyNoteMetric.setScreenPosition(screenPosition);
        }
      }),

      combineLatest([
        this.eventEmitter.on('isVisibleChanged_screenPosition').distinct(),
        this.parent.onZoomLevel()
      ]).subscribe(props => {
        const isVisible = props[0];
        const zoomLevel = props[1];

        if (isVisible && zoomLevel < 400) {
          if (!this.stickyNoteMetric) {
            this.stickyNoteMetric = new StickyNoteMetric(this);

            // force screen position update
            this.getComponent('screenPosition').updateScreenPosition(true);
          }
        } else if (this.stickyNoteMetric) {
          this.stickyNoteMetric.dispose();
          this.stickyNoteMetric = null;
        }
      })
    ]);
  }

  init() {
    super.init();

    this.particleEmitter = new ParticleEmitter({
      id: this.id + '__particleEmitter',
      parent: this
    });
  }

  getColors() {
    const rgb = hexToRGBNormalized(this.currentColor);
    const r = rgb.r;
    const g = rgb.g;
    const b = rgb.b;

    return [
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b
    ];
  }

  calculatePath(fromPos, toPos) {
    // move the path a little so that the source/target position is in the middle of the geometry
    fromPos.x -= 0.5;
    fromPos.z += 0.5;
    toPos.x -= 0.5;
    toPos.z += 0.5;

    return [fromPos, toPos];
  }

  positionChanged() {
    super.positionChanged();

    const from = this.direction === DIRECTIONS.OUT ? this.sourceNode : this.destinationNode;
    const to = this.direction === DIRECTIONS.OUT ? this.destinationNode : this.sourceNode;
    const fromPos = from.getComponent('position').getPosition();
    const toPos = to.getComponent('position').getPosition();

    this.particleEmitter.setFromAndTo(fromPos, toPos);
    this.particleEmitter.updateVertices();
  }

  dispose() {
    super.dispose();

    if (this.stickyNoteMetric) {
      this.stickyNoteMetric.dispose();
      this.stickyNoteMetric = null;
    }

    this.particleEmitter.dispose();
    this.particleEmitter = null;
  }
}
