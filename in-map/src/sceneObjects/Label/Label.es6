import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';
import SceneObject from '../SceneObject';


export default class Label extends SceneObject {

  constructor({parent, id, pluginId}) {
    super({parent, id});

    this.pluginId = pluginId;
    this.getFactory().addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.getFactory().removeFragment(this.id);
  }

  onInactiveLeave() {
    this.getFactory().addFragment(this.fragment);
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
    const size = this.pluginId === 'com.instana.forge.infrastructure.os.host.Host' ? 2.0 : 0.75;
    return this.scene.getLogoFactory(this.pluginId, size);
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
