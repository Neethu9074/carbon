import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/snapshot';

import SnapshotForgeInfo from 'in-sdk/components/sidebar/SnapshotForgeInfo';


export default connectTo(props => {
  return {
    snapshot: getClusterMembers(props.snapshotId).flatMap(ids => {
      const id = ids.first();
      return id
        ? getSnapshot(ids.first())
        : alwaysNull;
    })
  };
}, function ServiceInstancePhysicalEntity({snapshot}) {
  if (!snapshot) {
    return null;
  }

  const title = getSingular(snapshot.get('plugin')) + ': ' + getLabel(snapshot);

  return (
    <Collapsible initiallyOpen={true}>
      <Collapsible.Header>
        {title}
      </Collapsible.Header>
      <Collapsible.Content>
        <SnapshotForgeInfo snapshot={snapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
});
