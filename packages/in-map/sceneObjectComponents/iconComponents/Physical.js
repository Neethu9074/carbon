/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import IconComponent from 'in-map/sceneObjectComponents/iconComponents/IconComponent';
import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';

export default class PhysicalIconComponent extends IconComponent {
  constructor(sceneObject, iconSize, getIconPosition) {
    super(sceneObject, iconSize, getIconPosition);
  }

  initEvents() {
    super.initEvents();

    const snapshotChangedCallback = this.snapshotChanged.bind(this);
    this.addSubscription(this.sceneObject.eventEmitter.on('snapshotChanged').subscribe(snapshotChangedCallback));
  }

  snapshotChanged(snapshot) {
    const type = getIconType(snapshot) ?? '';
    this.fragment.additionalParams.type = type.substr('lib_infra_'.length);
    this.factory.needsUpdate();
  }
}
