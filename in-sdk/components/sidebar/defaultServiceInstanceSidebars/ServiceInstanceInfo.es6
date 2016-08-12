import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {getClusterMembers} from 'in-stores/clusterMembers';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import {getZone} from 'in-stores/zone';

export default connectTo(props => {
  return {
    component: getClusterMembers(props.snapshotId)
      .map(clusterMembers => clusterMembers.first())
      .flatMap(id => id ? getSnapshot(id) : alwaysNull),
    serviceEntity: getZone(props.snapshotId)
      .flatMap(id => id ? getSnapshot(id) : alwaysNull)
  };
}, function ServiceInstanceInfo({component, serviceEntity}) {
  return (
    <DescriptionList>
      {serviceEntity ?
        <DescriptionItem title={`Service (${getSingular(serviceEntity.get('plugin'))})`}>
          <SnapshotLink snapshotId={serviceEntity.get('id')}>
            {getLabel(serviceEntity)}
          </SnapshotLink>
        </DescriptionItem>
      : null}

      {component ?
        <DescriptionItem title={`Component (${getSingular(component.get('plugin'))})`}>
          <SnapshotLink snapshotId={component.get('id')}>
            {getLabel(component)}
          </SnapshotLink>
        </DescriptionItem>
      : null}
    </DescriptionList>
  );
});
