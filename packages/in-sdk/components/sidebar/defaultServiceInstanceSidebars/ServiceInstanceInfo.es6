import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Separator from 'in-sdk/components/sidebar/Separator';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { getZone } from 'in-stores/zone';

export default connectTo(
  props => {
    return {
      serviceEntity: getZone(props.snapshotId).flatMap(getSnapshot),
      physicalEntity: getClusterMembers(props.snapshotId)
        .map(clusterMembers => clusterMembers.first())
        .flatMap(getSnapshot)
    };
  },
  function ServiceInstanceInfo({ serviceEntity, physicalEntity }) {
    return (
      <div>
        {serviceEntity || physicalEntity ? <Separator /> : null}

        <DescriptionList>
          {serviceEntity ? (
            <DescriptionItem title={`Service (${getSingular(serviceEntity.get('plugin'))})`}>
              <SnapshotLink snapshotId={serviceEntity.get('id')}>{getLabel(serviceEntity)}</SnapshotLink>
            </DescriptionItem>
          ) : null}

          {physicalEntity ? (
            <DescriptionItem title={`Physical Component (${getSingular(physicalEntity.get('plugin'))})`}>
              <SnapshotLink snapshotId={physicalEntity.get('id')}>{getLabel(physicalEntity)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
        </DescriptionList>
      </div>
    );
  }
);
