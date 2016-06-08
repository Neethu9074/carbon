import {combineLatest} from 'reactive-observables';

import {renderConnectionLine} from 'in-map/src/2DSceneObjects/tooltips/process/ConnectionLine';
import BaseConnection from 'in-map/src/3DSceneObjects/common/Connection';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Bubbles from 'in-map/src/3DSceneObjects/process/Bubbles';
import {getColorPool} from 'in-services/util/ColorGenerator';
import {getSnapshot} from 'in-stores/snapshot';

import CLCP from '../../SingleMeshFactory/ContentProvider/ColoredLineContentProvider';
import ACP from '../../SingleMeshFactory/ContentProvider/ArrowContentProvider';


export default class Connection extends BaseConnection {

  constructor(params) {
    super(params);

    // subscribe to both snapshots to caluclate the color gradient between source and destination
    this.addSubscription(
       combineLatest([getSnapshot(this.sourceNode.id), getSnapshot(this.destinationNode.id)])
      .subscribe(snapshots => this.setColorFromSnapshots(snapshots[0], snapshots[1]))
    );

    this.bubbles = new Bubbles(this);
    this.bubbles.startAnimation();
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

  dispose() {
    // remove fragment first to save the id
    this.lineSMF.removeFragment(this.id);
    this.solidSMF.removeFragment(this.id);

    super.dispose();

    this.bubbles.dispose();
    this.bubbles = null;

    this.lineFragment = null;
  }
}
