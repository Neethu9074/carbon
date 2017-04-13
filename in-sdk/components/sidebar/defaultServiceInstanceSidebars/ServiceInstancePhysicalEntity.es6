import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SnapshotForgeInfo from 'in-sdk/components/sidebar/SnapshotForgeInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { getClusterMembers } from 'in-stores/clusterMembers';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      snapshot: getClusterMembers(props.snapshotId)
        .map(clusterMembers => clusterMembers.first())
        .flatMap(id => (id ? getSnapshot(id) : alwaysNull))
    };
  },
  function ServiceInstancePhysicalEntity({ snapshot }) {
    if (!snapshot) {
      return null;
    }

    const pluginLabel = getSingular(snapshot.get('plugin'));

    return (
      <div>
        <Separator />

        <Collapsible initiallyOpen>
          <Collapsible.Header>
            Component
          </Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title={pluginLabel}>
                <SnapshotLink snapshotId={snapshot.get('id')}>
                  {getLabel(snapshot)}
                </SnapshotLink>
              </DescriptionItem>
            </DescriptionList>
            <SnapshotForgeInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);
