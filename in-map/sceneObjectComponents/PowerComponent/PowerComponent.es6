import {combineLatest} from 'reactive-observables';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {maxPower$, setPower} from 'in-map/stores/physical/powerStore';
import {getPower} from 'in-sdk/power';


const BASE_HEIGHT = 1;
const MAX_HEIGHT = 3;

export default class PowerComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_power');
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      combineLatest([
        this.sceneObject.eventEmitter.on('snapshotChanged'),
        maxPower$.distinct()
      ]).subscribe(([snapshot, maxPower]) => {
        const power = getPower(snapshot);

        if (power > maxPower) {
          setPower(power);
          return;
        }

        // the final power was found
        this.power = getPower(snapshot);
        const weightedHeight = (MAX_HEIGHT - BASE_HEIGHT) * (power / maxPower);

        this.emitToClient('powerChanged', BASE_HEIGHT + weightedHeight);
      })
    );
  }

  dispose() {
    super.dispose();

    this.color = null;
  }
}
