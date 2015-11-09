import * as constants from 'in-forge/constants';

import {zoomLevel} from 'in-services/stores/zoomLevel';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';

import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import SceneObject from '../SceneObject';


export default class Label extends SceneObject {

  constructor({ id, parent, snapshot, iconSize = 1, predicate }) {
    super({parent, id});

    this.snapshot = snapshot;
    this.factory = this.getFactory();

    this.positionHandler = new PCM({ contentProvider: new PCP() });
    this.fragment = {
      id: this.id,
      contentProvider: this.positionHandler,
      additionalParams: { iconSize }
    };

    this.subscription = zoomLevel.subscribe(zl => {
      if (predicate(zl)) {
        this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
      } else {
        this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
      }
    });
  }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
  }

  onInactiveLeave() {
    this.factory.addFragment(this.fragment);
  }

  getFactory() {
    const snapshot = this.snapshot;

    let key = snapshot.get('pluginId');
    if (key === constants.plugins.os) {
      key += '_' + snapshot.getIn(['data', 'os.name']);
    }

    return this.scene.getOrCreateLogoFactory({ key, snapshot: this.snapshot });
  }

  positionChanged(x, y, z) {
    this.positionHandler.position.x = x;
    this.positionHandler.position.y = y;
    this.positionHandler.position.z = z;

    if (this.isActive()) {
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
