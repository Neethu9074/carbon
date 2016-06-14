import {combineLatest} from 'reactive-observables';

import {renderConnectionLine} from 'in-map/src/2DSceneObjects/tooltips/process/ConnectionLine';
import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/connection/Metric';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import {addEdge, removeEdge} from 'in-map/src/3DSceneObjects/process/processViewStores';
import BaseConnection from 'in-map/src/3DSceneObjects/common/Connection';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Bubbles from 'in-map/src/3DSceneObjects/process/Bubbles';
import {getSnapshot} from 'in-stores/snapshot';
import {getColor} from 'in-sdk/color/color';
import eventBus from 'in-map/eventbus';

import CLCP from '../../SingleMeshFactory/ContentProvider/ColoredLineContentProvider';


export default class Connection extends BaseConnection {

  constructor(params) {
    super(params);

    this.addSubscriptions([
      // subscribe to both snapshots to caluclate the color gradient between source and destination
      combineLatest([getSnapshot(this.sourceNode.id), getSnapshot(this.destinationNode.id)])
        .subscribe(snapshots => this.setColorFromSnapshots(snapshots[0], snapshots[1])),

      combineLatest([
        this.sourceNode.eventEmitter.on('positionChanged'),
        this.destinationNode.eventEmitter.on('positionChanged')
      ]).subscribe(() => this.positionChanged()),

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

        if (isVisible && zoomLevel < 250) {
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

    this.bubbles = new Bubbles(this);
    this.bubbles.startAnimation();

    addEdge(this);
  }

  onSelectedEnter() {
    console.log('onSelectedEnter');
  }

  onSelectedLeave() {
    console.log('onSelectedLeave');
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
    this.lineFragment.contentProvider.setColor([0, 0, 0, 0, 0, 0]);
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

  setColorFromSnapshots(sourceSnapshot, destinationSnapshot) {
    const sourceColor = getColor(sourceSnapshot);
    const destinationColor = getColor(destinationSnapshot);

    // since process connections are straight lines, we just need 2 * 3 floats for the gradient
    // + 4 * 3 colors for the arrow
    this.lineFragment.contentProvider.setColor([
      sourceColor.r, sourceColor.g, sourceColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b
    ]);

    // refreshes the fragment
    this.lineSMF.addFragment(this.lineFragment);
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

    this.bubbles.dispose();
    this.bubbles = null;

    this.lineFragment = null;
  }
}
