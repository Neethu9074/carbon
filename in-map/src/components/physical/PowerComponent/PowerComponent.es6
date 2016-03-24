import {getSnapshot} from 'in-stores/snapshot';
import {nodeMaxPower} from 'in-map/src/mapStores';
import {getPower} from 'in-sdk/power';

import Component from '../../common/Component';


const BASE_POWER = 1;

export default class PowerComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject, '_power');

    this.power = 1;
    this.snapshotSubscription = getSnapshot(sceneObject.id).subscribe(this.onSnapshotUpdate.bind(this));
  }

  onSnapshotUpdate(snapshot) {
    this.power = getPower(snapshot);

    // setup height subscription
    this.disposeSubscription(this.maxHeightSubscribtion);
    this.maxHeightSubscribtion = nodeMaxPower.subscribe(maxPower => {
      if (maxPower) {
        if (this.power < 0) {
          this.setPower(1);
          return;
        }
        if (this.power > maxPower) {
          nodeMaxPower.emit(this.power);
          return;
        }
        this.updatePower(maxPower, snapshot);
      }
    });
  }

  disposeSubscription(subscribtion) {
    if (subscribtion) {
      subscribtion.dispose();
    }
  }

  updatePower(maxPower, snapshot) {
    const maxNodeHeight = 3;
    this.power = getPower(snapshot);
    const weightedHeight = (maxNodeHeight - BASE_POWER) * (this.power / maxPower);
    this.setPower(BASE_POWER + weightedHeight);
  }

  setPower(power) {
    this.emit('powerChanged', power);
  }

  dispose() {
    super.dispose();

    this.disposeSubscription(this.snapshotSubscription);
    this.disposeSubscription(this.maxHeightSubscribtion);

    // is disposed via Subscriber.dispose()
    this.maxHeightSubscribtion = null;
  }
}
