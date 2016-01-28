import {zoomLevel} from 'in-services/stores/zoomLevel';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import SceneObjectWithSnapshot from '../SceneObjectWithSnapshot';


export default class Label extends SceneObjectWithSnapshot {

  constructor({id, parent, iconSize = 1, predicate}) {
    super({parent, id});

    this.factory = this.scene.getOrCreateLogoFactory('default', undefined);

    this.fragment = this.getFragment(iconSize);
    this.positionHandler = this.getPositionHandler();

    this.addSubscription(zoomLevel.subscribe(zl => {
      const isHidden = predicate(zl) ? PROPERTY_VALUES.OFF : PROPERTY_VALUES.ON;
      this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, isHidden);
    }));
  }

  getFragment() { throw new Error('PLEASE OVERRIDE METHOD'); }
  getPositionHandler() { throw new Error('PLEASE OVERRIDE METHOD'); }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
  }

  onInactiveLeave() {
    this.factory.addFragment(this.fragment);
  }

  positionChanged(x, y, z) {
    this.positionHandler.position.x = x;
    this.positionHandler.position.y = y;
    this.positionHandler.position.z = z;

    this.updateFragment();
  }

  updateFragment() {
    if (this.isActive()) {
      this.factory.addFragment(this.fragment);
    }
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);
    this.id = null;
  }
}
