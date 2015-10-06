import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';
import SceneObject from '../SceneObject';


export default class Label extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});
  }

  onInitialEnter() {
    this.getFactory().addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.getFactory().removeFragment(this.id);
  }


  init() {
    super.init();

    this.positionHandler = new PCM({ contentProvider: new PCP() });
    this.fragment = {
      id: this.id,
      contentProvider: this.positionHandler
    };
  }


  getFactory() {
    return this.scene.getLogoFactory(this.parent._cachedPluginId);
  }

  positionChanged(x, y, z) {
    this.positionHandler.position.x = x;
    this.positionHandler.position.y = y;
    this.positionHandler.position.z = z;

    if (this.isActive) {
      this.getFactory().addFragment(this.fragment);
    }
  }

  dispose() {
    super.dispose();

    this.getFactory().removeFragment(this.id);
    this.id = null;
  }
}
