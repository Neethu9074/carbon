import {combineLatest} from 'reactive-observables';

import {renderConnectionLine} from 'in-map/src/2DSceneObjects/tooltips/process/ConnectionLine';
import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/connection/Metric';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import {addEdge, removeEdge} from 'in-map/src/3DSceneObjects/process/processViewStores';
import BaseConnection from 'in-map/src/3DSceneObjects/common/Connection';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Bubbles from 'in-map/src/3DSceneObjects/process/Bubbles';
import {getColorPool} from 'in-services/util/ColorGenerator';
import {getSnapshot} from 'in-stores/snapshot';
import eventBus from 'in-map/eventbus';

import CLCP from '../../SingleMeshFactory/ContentProvider/ColoredLineContentProvider';
import ACP from '../../SingleMeshFactory/ContentProvider/ArrowContentProvider';


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
    this.solidSMF = this.parent.getFactory('solidSMF');

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

    this.arrowFragment = {
      id: this.id,
      contentProvider: new ACP()
    };
    // the default color must be set to get a working shader. It's black so you can
    // see if there is a snapshot missing
    this.arrowFragment.contentProvider.setColor([0, 0, 0, 0, 0, 0]);
  }

  updateGeometry() {
    this.lineFragment.contentProvider.setLines(this.getLineVertices(this.sourceNode, this.destinationNode));
    this.lineSMF.addFragment(this.lineFragment);

    const from = this.direction === DIRECTIONS.OUT ? this.sourceNode : this.destinationNode;
    const to = this.direction === DIRECTIONS.OUT ? this.destinationNode : this.sourceNode;
    this.arrowFragment.contentProvider.setFromTo(from.getComponent('position').getPosition().clone(),
                                                 to.getComponent('position').getPosition().clone());
    this.solidSMF.addFragment(this.arrowFragment);
  }

  calculatePath(fromPos, toPos) {
    // move the path a little so that the source/target position is in the middle of the geometry
    fromPos.x -= 0.5;
    fromPos.z += 0.5;
    toPos.x -= 0.5;
    toPos.z += 0.5;

    return [fromPos, toPos];
  }

  postProPath(path) {
    const first = path[0];
    const second = path[1];
    const dirFirstToSecond = this.getDirectionForPoints(first, second);
    const dirlastToBeforeLast = this.getDirectionForPoints(second, first);

    // caps the first and last line of the connection. nodes have a size of 1 and
    // normally the connection goes from center (0.5, 0.5) to center. with this
    // capping it begins on the edge of the first and ends on the edge of the
    // last node. to get the right of the four possible we need the direction
    // directions are normalized so you can multiply with 0.5
    first.x += dirFirstToSecond.x * 0.5;
    first.y += dirFirstToSecond.y * 0.5;
    first.z += dirFirstToSecond.z * 0.5;

    second.x += dirlastToBeforeLast.x * 0.5;
    second.y += dirlastToBeforeLast.y * 0.5;
    second.z += dirlastToBeforeLast.z * 0.5;

    return path;
  }

  setColorFromSnapshots(sourceSnapshot, destinationSnapshot) {
    const colorPool = getColorPool('processes');
    const sourceColor = colorPool.getColorRGB(sourceSnapshot.get('plugin'));
    const destinationColor = colorPool.getColorRGB(destinationSnapshot.get('plugin'));

    // since process connections are straight lines, we just need 2 * 3 floats for the gradient
    this.lineFragment.contentProvider.setColor([
      sourceColor.r, sourceColor.g, sourceColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b
    ]);

    const color = this.direction === DIRECTIONS.OUT ? destinationColor : sourceColor;
    this.arrowFragment.contentProvider.setColor(color);

    // refreshes the fragment
    this.lineSMF.addFragment(this.lineFragment);
    this.solidSMF.addFragment(this.arrowFragment);
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
    this.solidSMF.removeFragment(this.id);
    this.lineSMF = null;
    this.solidSMF = null;

    super.dispose();

    this.bubbles.dispose();
    this.bubbles = null;

    this.lineFragment = null;
  }
}
