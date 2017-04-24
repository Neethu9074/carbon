import { combineLatest } from 'reactive-observables';

import IconComponent from 'in-map/sceneObjectComponents/iconComponents/IconComponent';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { emptyArray } from 'in-services/fixedObjects';
import { getIconPath } from 'in-sdk/iconRegistry';
import { getSnapshot } from 'in-stores/snapshot';

export default class LogicalIconComponent extends IconComponent {
  constructor(sceneObject, iconSize, getIconPosition) {
    super(sceneObject, iconSize, getIconPosition);
  }

  initEvents() {
    super.initEvents();

    const eventEmitter = this.sceneObject.eventEmitter;

    eventEmitter.emit('clusterMemberChanged', emptyArray);

    const clusterMemberChangedCallback = this.clusterMemberChanged.bind(this);
    const iconsChangedCallback = this.iconsChanged.bind(this);

    this.addSubscriptions([
      getClusterMembers(this.sceneObject.id)
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .subscribe(clusterMemberChangedCallback),

      combineLatest([eventEmitter.on('snapshotChanged'), eventEmitter.on('clusterMemberChanged')]).subscribe(
        iconsChangedCallback
      )
    ]);
  }

  clusterMemberChanged(clusterMember) {
    this.sceneObject.eventEmitter.emit('clusterMemberChanged', clusterMember);
  }

  iconsChanged([snapshot, clusterMember]) {
    const plugins = {};
    clusterMember.forEach(member => plugins[member.get('plugin')] = true);

    this.fragment.additionalParams.type = Object.keys(plugins).length !== 1
      ? getIconPath(snapshot)
      : getIconPath(clusterMember[0]);

    this.factory.needsUpdate();
  }
}
