import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';
import SceneObject from '../SceneObject';


export default class Label extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.positionHandler = new PCM({ contentProvider: new PCP() });
    this.fragment = {
      id,
      contentProvider: this.positionHandler
    };
  }

  onInitialEnter() {
    this.scene.getLogoFactory().addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.scene.specialTestFactory.removeFragment(this.id);
  }


  positionChanged(x, y, z) {
    this.positionHandler.position.x = x;
    this.positionHandler.position.y = y;
    this.positionHandler.position.z = z;

    if (this.isActive) {
      this.scene.getLogoFactory().addFragment(this.fragment);
    }
  }

  dispose() {
    super.dispose();

    this.scene.specialTestFactory.removeFragment(this.id);
    this.id = null;
  }
}
