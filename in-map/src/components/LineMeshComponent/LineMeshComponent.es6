import Component from '../Component';


export default class LineMeshComponent extends Component {
  constructor({sceneObject, contentProvider, id, factory}) {
    super(sceneObject);

    this.id = id;
    this.contentProvider = contentProvider;
    this.factory = factory;
    this.fragment = {id, contentProvider};

    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.scaleToSet = {x: 1, y: 1, z: 1};
    this.colorToSet = {r: 1, g: 1, b: 1};

    this.updateContentProvider();

    this.initialized();
  }

  onInitialEnter() {
    this.factory.addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
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

  colorChanged(r, g, b) {
    const color = this.colorToSet;
    if(color.r === r && color.g === g && color.b === b) {
      return;
    }

    this.colorToSet.r = r;
    this.colorToSet.g = g;
    this.colorToSet.b = b;

    this.needsUpdate = true;
  }

  changeXyzOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  update() {
    this.needsUpdate = false;
    this.updateContentProvider();

    if(this.isActive()) {
      this.factory.addFragment(this.fragment);
    }
  }

  updateContentProvider() {
    const pcm = this.contentProvider;
    const scm = pcm.contentProvider;
    const lcp = scm.contentProvider;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;

    this.changeXyzOf(pcm.position, pos.x, pos.y, pos.z);
    this.changeXyzOf(scm.scale, scale.x, scale.y, scale.z);

    lcp.setColor(this.colorToSet);
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);
  }
}
