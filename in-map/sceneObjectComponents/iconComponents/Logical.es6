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

    this.addSubscriptions([
      getClusterMembers(this.sceneObject.id)
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .subscribe(clusterMember => eventEmitter.emit('clusterMemberChanged', clusterMember)),
      combineLatest([eventEmitter.on('snapshotChanged'), eventEmitter.on('clusterMemberChanged')]).subscribe(([
        snapshot,
        clusterMember
      ]) => {
        const plugins = {};
        clusterMember.forEach(member => plugins[member.get('plugin')] = true);

        this.fragment.additionalParams.type = Object.keys(plugins).length !== 1
          ? getIconPath(snapshot)
          : getIconPath(clusterMember[0]);

        this.factory.needsUpdate();
      })
    ]);
  }
}
