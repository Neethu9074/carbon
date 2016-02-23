import Component from '../Component';
import XYZ from '../XYZ';
import RGB from '../RGB';


export default class LineMeshComponent extends Component {

  constructor({sceneObject, contentProvider, factory}) {
    super(sceneObject, '_line_mesh');

    this.contentProvider = contentProvider;
    this.fragment = {id: this.id, contentProvider};
    this.factory = factory;
    this.highlightingSingleMeshFactory = sceneObject.scene.lineFactory;

    this.positionToSet = new XYZ(-1000, 0, 0);
    this.scaleToSet = new XYZ(1, 1, 1);
    this.colorToSet = new RGB(1, 1, 1);

    this.updateContentProvider();
    this.initialized();

    this.addSubscription('positionChanged', this.positionChanged);
    this.addSubscription('sizeChanged', this.sizeChanged);
    this.addSubscription('colorChanged', this.colorChanged);
  }

  onInitialEnter() {
    this.factory.addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
  }

  onSelectedEnter() {
    this.highlightingSingleMeshFactory.addFragment(this.fragment);
  }

  onSelectedLeave() {
    this.highlightingSingleMeshFactory.removeFragment(this.id);
  }


  positionChanged({newPosition}) {
    this.positionToSet.set(newPosition.x, newPosition.y, newPosition.z);
    this.needsUpdate = true;
  }

  sizeChanged({x, y, z}) {
    const scale = this.scaleToSet;
    if (scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.scaleToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  colorChanged({r, g, b}) {
    const color = this.colorToSet;
    if (color.r === r && color.g === g && color.b === b) {
      return;
    }

    this.colorToSet.set(r, g, b);
    this.needsUpdate = true;
  }

  update() {
    this.needsUpdate = false;
    this.updateContentProvider();

    if (this.isActive()) {
      this.factory.addFragment(this.fragment);
    }
  }

  updateContentProvider() {
    const pcm = this.contentProvider;
    const scm = pcm.contentProvider;
    const lcp = scm.contentProvider;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;

    this.changeXYZOf(pcm.position, pos.x, pos.y, pos.z);
    this.changeXYZOf(scm.scale, scale.x, scale.y, scale.z);

    lcp.setColor(this.colorToSet);
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);


    this.positionToSet.dispose();
    this.scaleToSet.dispose();
    this.colorToSet.dispose();

    this.contentProvider = null;
    this.positionToSet = null;
    this.scaleToSet = null;
    this.colorToSet = null;
    this.fragment = null;
    this.factory = null;
    this.id = null;
  }
}
