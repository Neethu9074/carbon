import {combineLatest} from 'reactive-observables';

import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/connection/KPI';
import ParticleEmitter from 'in-map/src/3DSceneObjects/common/ParticleEmitter';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Connection from 'in-map/src/3DSceneObjects/process/Connection';


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
        this.eventEmitter.on('onHighlight')
                         .debounce(100)
                         .distinct(),
        this.parent.onZoomLevel()
      ]).subscribe(([isVisible, isHighlighted, zoomLevel]) =>
        (isVisible && (zoomLevel < 500 || isHighlighted)) ?
          this.getOrCreateMetricSticky(isHighlighted) :
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

  getOrCreateMetricSticky(isHighlighted) {
    if (!this.stickyNoteMetric) {
      this.stickyNoteMetric = new StickyNoteMetric(this);

      // force screen position update
      this.getComponent('screenPosition').updateScreenPosition(true);
    }
    this.stickyNoteMetric.setHighlighted(isHighlighted);
  }

  disposeMetricSticky() {
    if (this.stickyNoteMetric) {
      this.stickyNoteMetric.dispose();
      this.stickyNoteMetric = null;
    }
  }

  getFactory() {
    return this.parent.getFactory('lineSMF');
  }

  getColorArrayFromRgb(r, g, b) {
    return [
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,

      r, g, b,
      r, g, b
    ];
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
