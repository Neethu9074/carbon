import Component from '../Component';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import LCP from '../../SingleMeshFactory/ContentProvider/LineContentProvider';

export default class HighlightingComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject);

    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.scaleToSet = {x: 1, y: 1, z: 1};

    this.lineContentProvider = new LCP();
    this.fragment = {
      id: this.getID(),
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: this.lineContentProvider
        })
      })
    };
    this.setupHighlightBorderLines();

    this.initialized();
  }

  onInitialEnter() {
    this.show();
  }

  onInactiveEnter() {
    this.hide();
  }


  positionChanged(x, y, z) {
    this.changeXyzOf(this.positionToSet, x, y, z);
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    const scale = this.scaleToSet;
    if(scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.changeXyzOf(this.scaleToSet, x, y, z);
    this.needsUpdate = true;
  }

  changeXyzOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  update() {
    this.setupHighlightBorderLines();

    this.hide();
    if(this.isActive()) {
      this.show();
    }

    this.needsUpdate = false;
  }

  setupHighlightBorderLines() {
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const fromX = pos.x - ((1 - scale.x) / 2) + 0.01;
    const toX = fromX - scale.x - 0.02;
    const fromY = pos.y - 0.01;
    const toY = fromY + scale.y + 0.02;
    const fromZ = pos.z - 0.01 + ((1 - scale.z) / 2);
    const toZ = fromZ + scale.z + 0.02;

    this.lineContentProvider.setLines([
      toX, fromY, fromZ,
      toX, fromY, toZ,

      toX, fromY, toZ,
      fromX, fromY, toZ,

      fromX, fromY, toZ,
      fromX, fromY, fromZ,

      fromX, fromY, fromZ,
      toX, fromY, fromZ,

      toX, fromY, fromZ,
      toX, toY, fromZ,

      fromX, fromY, toZ,
      fromX, toY, toZ,

      toX, toY, fromZ,
      fromX, toY, fromZ,

      fromX, toY, fromZ,
      fromX, toY, toZ
    ]);
  }

  show() {
    this.sceneObject.scene.lineFactory.addFragment(this.fragment);
  }

  hide() {
    this.sceneObject.scene.lineFactory.removeFragment(this.getID());
  }

  getID() {
    return this.sceneObject.id + '_highlight';
  }

  dispose() {
    super.dispose();

    this.lineContentProvider = null;
    this.positionToSet = null;
    this.scaleToSet = null;
    this.fragment = null;
  }
}
