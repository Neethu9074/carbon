import {zoomLevel} from 'in-services/stores/zoomLevel';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';

import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import SceneObject from '../SceneObject';


export default class Label extends SceneObject {

  constructor({ id, parent, iconSize = 1, predicate }) {
    super({parent, id});

    this.factory = this.getFactory();

    this.positionHandler = new PCM({ contentProvider: new PCP() });
    this.fragment = {
      id: this.id,
      contentProvider: this.positionHandler,
      additionalParams: { iconSize }
    };

    this.addSubscription(zoomLevel.subscribe(zl => {
      const isHidden = predicate(zl) ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.stateMachine.changeStateProperty('hidden', isHidden);
    }));
  }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
  }

  onInactiveLeave() {
    this.factory.addFragment(this.fragment);
  }

  onHiddenEnter() {
    this.factory.removeFragment(this.id);
  }

  onHiddenLeave() {
    this.factory.addFragment(this.fragment);
  }


  getFactory() {
    const key = this.parent.snapshot ? this.parent.snapshot.get('plugin') : this.id;
    return this.scene.getOrCreateLogoFactory(key, this.parent.snapshot);
  }

  positionChanged(x, y, z) {
    this.positionHandler.position.x = x;
    this.positionHandler.position.y = y;
    this.positionHandler.position.z = z;

    if (this.isActive() && !this.isHidden()) {
      this.factory.addFragment(this.fragment);
    }
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);
    this.id = null;
  }
}
