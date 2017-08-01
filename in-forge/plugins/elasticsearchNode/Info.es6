import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import ClusterStatusLabel from 'in-forge/plugins/elasticsearchCluster/ClusterStatusLabel';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import { getZone } from 'in-stores/zone';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      zoneSnapshot: getZone(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function ElasticsearchInfo({ snapshot, zoneSnapshot }) {
    const data = snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title="Version">
          {data.get('version')}
        </DescriptionItem>

        {zoneSnapshot
          ? <DescriptionItem title="Cluster">
              <SnapshotLink snapshotId={zoneSnapshot.get('id')}>
                {getLabel(zoneSnapshot)}
              </SnapshotLink>
            </DescriptionItem>
          : null}

        <DescriptionItem title="Status">
          <ClusterStatusLabel status={data.get('cluster_health.status')} />
        </DescriptionItem>

        <DescriptionItem title="Node">
          {data.get('node.name')}
        </DescriptionItem>

        <DescriptionItem title="Node Type">
          {data.get('node.type')}
        </DescriptionItem>

        <DescriptionItem title="Master">
          {data.get('node.master')}
        </DescriptionItem>

        <DescriptionItem title="Master Eligible">
          {data.get('node.master_eligible')}
        </DescriptionItem>

        <DescriptionItem title="Transport">
          {data.get('transport')}
        </DescriptionItem>

        <DescriptionItem title="Log Directory">
          {data.get('log.dir')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
);
