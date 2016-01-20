import {zoomLevel} from 'in-services/stores/zoomLevel';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';

import SceneObjectWithSnapshot from '../SceneObjectWithSnapshot';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';


export default class Label extends SceneObjectWithSnapshot {

  constructor({id, parent, iconSize = 1, predicate, color = {r: 1, g: 1, b: 1}}) {
    super({parent, id});

    this.factory = this.getFactory();

    this.positionHandler = new PCM({
      contentProvider: new CMCM({
        contentProvider: new PCP(),
        r: color.r, g: color.g, b: color.b
     })
    });
    this.fragment = {
      id,
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


  onSnapshotUpdated() {
    this.factory.removeFragment(this.id);
    this.factory = this.getFactory();
    this.updateFragment();
  }

  getFactory() {
    const key = this.snapshot ? this.snapshot.get('plugin') : 'default';
    return this.scene.getOrCreateLogoFactory(key, this.snapshot);
  }

  positionChanged(x, y, z) {
    this.positionHandler.position.x = x;
    this.positionHandler.position.y = y;
    this.positionHandler.position.z = z;

    this.updateFragment();
  }

  updateFragment() {
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
