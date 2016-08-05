import {combineLatest} from 'reactive-observables';

import {getClusterMembers} from 'in-stores/clusterMembers';
import {emptyArray} from 'in-services/fixedObjects';
import {getIconPath} from 'in-sdk/iconRegistry';
import {getSnapshot} from 'in-stores/snapshot';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PointContentProvider';

import BaseLabel from '../common/Label';


export default class Label extends BaseLabel {

  constructor(config) {
    super(config);

    this.eventEmitter.emit('clusterMemberChanged', emptyArray);

    this.addSubscriptions([
      getClusterMembers(this.parent.id)
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .subscribe(clusterMember => this.eventEmitter.emit('clusterMemberChanged', clusterMember)),

      combineLatest([
        this.eventEmitter.on('snapshotChanged'),
        this.eventEmitter.on('clusterMemberChanged')
      ]).subscribe(([snapshot, clusterMember]) => {
        this.factory.removeFragment(this.id);

        const plugins = {};
        clusterMember.forEach(member => plugins[member.get('plugin')] = true);

        this.fragment.additionalParams.type = Object.keys(plugins).length !== 1
          ? getIconPath(snapshot)
          : getIconPath(clusterMember[0]);

        this.updateFragment();
      })
    ]);
  }

  getFragment(iconSize) {
    return {
      id: this.id,
      contentProvider: new PCM({
        contentProvider: new CMCM({
          contentProvider: new PCP()
        })
      }),
      additionalParams: { iconSize, type: 'unknown' }
    };
  }

  getPositionHandler() {
    return this.fragment.contentProvider;
  }
}
