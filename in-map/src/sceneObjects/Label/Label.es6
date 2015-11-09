import * as constants from 'in-forge/constants';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';
import SceneObject from '../SceneObject';


export default class Label extends SceneObject {

  constructor({
    id,
    parent,
    snapshot,
    iconSize = 1,
    predicateToHide
  }) {
    super({parent, id});

    this.snapshot = snapshot;
    this.predicateToHide = predicateToHide;

    this.positionHandler = new PCM({ contentProvider: new PCP() });
    this.fragment = {
      id: this.id,
      contentProvider: this.positionHandler,
      additionalParams: { iconSize }
    };

    this.getFactory().addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.getFactory().removeFragment(this.id);
  }

  onInactiveLeave() {
    this.getFactory().addFragment(this.fragment);
  }

  getFactory() {
    const snapshot = this.snapshot;

    let key = snapshot.get('pluginId');
    if (key === constants.plugins.os) {
      key += '_' + snapshot.getIn(['data', 'os.name']);
    }

    return this.scene.getOrCreateLogoFactory({
      key,
      snapshot: this.snapshot,
      predicateToHide: this.predicateToHide
    });
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
