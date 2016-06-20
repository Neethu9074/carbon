import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import {getPartsForCount} from 'in-map/src/3DSceneObjects/process/dashedLineHelper';
import {addEdge, removeEdge} from 'in-map/src/stores/process/edgesStore';
import BaseConnection from 'in-map/src/3DSceneObjects/common/Connection';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import eventBus from 'in-map/src/eventbus';

import CLCP from '../../SingleMeshFactory/ContentProvider/ColoredLineContentProvider';


const NUM_LINES = 10;

export default class Connection extends BaseConnection {

  constructor(params) {
    super(params);

    this.withArrows = false;

    this.addSubscriptions([
      this.sourceNode.eventEmitter.on('positionChanged')
      .merge(this.destinationNode.eventEmitter.on('positionChanged'))
        .debounce(10)
        .subscribe(() => this.positionChanged()),

      eventBus.on('endUpdate').subscribe(() => this.getComponent('screenPosition').updateScreenPosition())
    ]);

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
    // the default color must be set to get a working shader. It's black so you can see if there is a snapshot missing
    this.lineFragment.contentProvider.setColor(this.getColors());
  }

  getColors() {
    const baseColor = 0.73;
    const colors = [
      baseColor, baseColor, baseColor,
      baseColor, baseColor, baseColor,
      baseColor, baseColor, baseColor,
      baseColor, baseColor, baseColor
    ];
    for (let i = 0; i <= NUM_LINES; i++) {
      colors.push(baseColor, baseColor, baseColor, baseColor, baseColor, baseColor);
    }
    return colors;
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

    const lines = [];
    const parts = getPartsForCount(NUM_LINES);
    const direction = {
      x: toPos.x - fromPos.x,
      y: toPos.y - fromPos.y,
      z: toPos.z - fromPos.z
    };
    for (let i = 0; i < parts.length; i += 2) {
      const from = parts[i];
      const to = parts[i + 1];

      lines.push({
        x: fromPos.x + direction.x * from,
        y: fromPos.y + direction.y * from,
        z: fromPos.z + direction.z * from
      });
      lines.push({
        x: fromPos.x + direction.x * to,
        y: fromPos.y + direction.y * to,
        z: fromPos.z + direction.z * to
      });
    }

    return lines;
  }

  positionChanged() {
    this.updateGeometry();

    const from = this.direction === DIRECTIONS.OUT ? this.sourceNode : this.destinationNode;
    const to = this.direction === DIRECTIONS.OUT ? this.destinationNode : this.sourceNode;
    const fromPos = from.getComponent('position').getPosition().clone();
    const toPos = to.getComponent('position').getPosition().clone();
    const pos = fromPos.add(toPos.sub(fromPos).multiplyScalar(0.5));

    this.getComponent('screenPosition').set3DPositionToProject(pos.x - 0.5, 0, pos.z + 0.5);

    this.scene.renderScene();
  }

  dispose() {
    removeEdge(this);

    // remove fragment first to save the id
    this.lineSMF.removeFragment(this.id);
    this.lineSMF = null;

    super.dispose();
    this.lineFragment = null;
  }
}
