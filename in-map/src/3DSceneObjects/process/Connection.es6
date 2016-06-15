import {combineLatest} from 'reactive-observables';

import {renderConnectionLine} from 'in-map/src/2DSceneObjects/tooltips/process/ConnectionLine';
import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/connection/Metric';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import {addEdge, removeEdge} from 'in-map/src/3DSceneObjects/process/processViewStores';
// import ParticleEmitter from 'in-map/src/3DSceneObjects/common/ParticleEmitter';
import BaseConnection from 'in-map/src/3DSceneObjects/common/Connection';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
// import Bubbles from 'in-map/src/3DSceneObjects/process/Bubbles';
import eventBus from 'in-map/eventbus';

import CLCP from '../../SingleMeshFactory/ContentProvider/ColoredLineContentProvider';


export default class Connection extends BaseConnection {

  constructor(params) {
    super(params);

    this.addSubscriptions([
      combineLatest([
        this.sourceNode.eventEmitter.on('positionChanged'),
        this.destinationNode.eventEmitter.on('positionChanged')
      ]).subscribe(() => this.positionChanged()),

      // eventBus.on('beginUpdate').subscribe(() => this.particleEmitter.update()),
      eventBus.on('endUpdate').subscribe(() => this.getComponent('screenPosition').updateScreenPosition()),

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

    // this.bubbles = new Bubbles(this);
    // this.bubbles.startAnimation();
    //
    // this.particleEmitter = new ParticleEmitter({
    //   id: this.id + '__particleEmitter',
    //   parent: this
    // });
    // this.particleEmitter.setPostition(this.sourceNode.getComponent('position').getPosition());
    // this.particleEmitter.lookAt(this.destinationNode.getComponent('position').getPosition());
    // this.particleEmitter.start();

    addEdge(this);
  }

  onSelectedEnter() {
    // console.log('onSelectedEnter');
  }

  onSelectedLeave() {
    // console.log('onSelectedLeave');
  }


  init() {
    this.lineSMF = this.parent.getFactory('lineSMF');

    super.init();
  }

  initComponents() {
    super.initComponents();

    this.components.screenPosition = new ScreenPositionComponent({sceneObject: this, id: '_screenPosition'});
  }

  setupGeometry() {
    this.lineFragment = {
      id: this.id,
      contentProvider: new CLCP()
    };
    // the default color must be set to get a working shader. It's black so you can
    // see if there is a snapshot missing
    this.lineFragment.contentProvider.setColor([
      0.73, 0.73, 0.73,
      0.73, 0.73, 0.73,
      0.73, 0.73, 0.73,
      0.73, 0.73, 0.73,
      0.73, 0.73, 0.73,
      0.73, 0.73, 0.73
    ]);
  }

  updateGeometry() {
    this.lineFragment.contentProvider.setLines(this.getLineVertices(this.sourceNode, this.destinationNode));
    this.lineSMF.addFragment(this.lineFragment);
  }

  calculatePath(fromPos, toPos) {
    // move the path a little so that the source/target position is in the middle of the geometry
    fromPos.x -= 0.5;
    fromPos.z += 0.5;
    toPos.x -= 0.5;
    toPos.z += 0.5;

    return [fromPos, toPos];
  }

  getTooltipLine() {
    return renderConnectionLine(this);
  }

  positionChanged() {
    this.updateGeometry();

    const from = this.direction === DIRECTIONS.OUT ? this.sourceNode : this.destinationNode;
    const to = this.direction === DIRECTIONS.OUT ? this.destinationNode : this.sourceNode;
    const fromPos = from.getComponent('position').getPosition().clone();
    const toPos = to.getComponent('position').getPosition().clone();
    const pos = fromPos.add(toPos.sub(fromPos).multiplyScalar(0.5));

    this.getComponent('screenPosition').set3DPositionToProject(pos.x - 0.5, 0, pos.z + 0.5);

    // this.particleEmitter.setPostition(fromPos);
    // this.particleEmitter.lookAt(toPos);
  }

  dispose() {
    removeEdge(this);

    if (this.stickyNoteMetric) {
      this.stickyNoteMetric.dispose();
      this.stickyNoteMetric = null;
    }

    // remove fragment first to save the id
    this.lineSMF.removeFragment(this.id);
    this.lineSMF = null;

    super.dispose();

    // this.particleEmitter.dispose();
    // this.particleEmitter = null;
    //
    // this.bubbles.dispose();
    // this.bubbles = null;

    this.lineFragment = null;
  }
}
