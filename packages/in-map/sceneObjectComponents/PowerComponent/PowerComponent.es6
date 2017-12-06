import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { powers, maxPower$ } from 'in-map/stores/physical/powerStore';
import { getPower } from 'in-sdk/snapshot';

const BASE_HEIGHT = 1;
const MAX_HEIGHT = 3;

export default class PowerComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_power');
  }

  initEvents() {
    super.initEvents();

    const snapshotChangedCallback = this.snapshotChanged.bind(this);
    const maxPowerChangedCallback = this.maxPowerChanged.bind(this);
    this.addSubscriptions([
      this.sceneObject.eventEmitter.on('snapshotChanged').subscribe(snapshotChangedCallback),
      maxPower$.subscribe(maxPowerChangedCallback)
    ]);
  }

  snapshotChanged(snapshot) {
    powers.add(this.id, getPower(snapshot));
  }

  maxPowerChanged(maxPower) {
    const power = powers.get(this.id);
    if (!power) {
      return;
    }
    const weightedHeight = Math.min(
      MAX_HEIGHT,
      Math.max(BASE_HEIGHT, BASE_HEIGHT + (MAX_HEIGHT - BASE_HEIGHT) * Math.min(1, power / maxPower))
    );
    this.emitToClient('powerChanged', weightedHeight);
  }

  disposeEvents() {
    super.disposeEvents();

    powers.remove(this.id);
  }
}
