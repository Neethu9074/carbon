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

    this.subscription = zoomLevel.subscribe(zl => {
      if (predicate(zl)) {
        this.stateMachine.changeStateProperty('hidden', PROPERTY_VALUES.ON);
      } else {
        this.stateMachine.changeStateProperty('hidden', PROPERTY_VALUES.OFF);
      }
    });
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
    return this.scene.getOrCreateLogoFactory(this.id);
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
    // dipose subscription first to avoid race conditions
    this.subscription.dispose();

    super.dispose();

    this.factory.removeFragment(this.id);
    this.id = null;
  }
}
