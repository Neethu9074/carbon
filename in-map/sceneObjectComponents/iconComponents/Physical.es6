import IconComponent from 'in-map/sceneObjectComponents/iconComponents/IconComponent';
import {getIconPath} from 'in-sdk/iconRegistry';


export default class PhysicalIconComponent extends IconComponent {

  constructor(sceneObject, iconSize, getIconPosition) {
    super(sceneObject, iconSize, getIconPosition);
  }

  initEvents() {
    super.initEvents();

    const snapshotChangedCallback = this.snapshotChanged.bind(this);
    this.addSubscription(
      this.sceneObject.eventEmitter.on('snapshotChanged').subscribe(snapshotChangedCallback)
    );
  }

  snapshotChanged(snapshot) {
    this.fragment.additionalParams.type = getIconPath(snapshot);
    this.factory.needsUpdate();
  }
}
