import React from 'react';

import { getSnapshot, getFoundations } from 'in-stores/snapshot';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import getForgeComponent from 'in-services/getForgeComponent';
import Separator from 'in-sdk/components/sidebar/Separator';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSingular } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      foundationSnapshot: getFoundations(props.snapshotId).flatMap(
        snapshots => (snapshots.size > 0 ? getSnapshot(snapshots.first()) : alwaysNull)
      )
    };
  },
  function HostHardware({ foundationSnapshot }) {
    if (!foundationSnapshot) {
      return null;
    }
    const Details = getForgeSpecificComponent(foundationSnapshot);

    return (
      <div>
        <Separator />

        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>
            {getSingular(foundationSnapshot.get('plugin'))}
          </Collapsible.Header>
          <Collapsible.Content>
            <Details snapshot={foundationSnapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);

function getForgeSpecificComponent(snapshot) {
  return getForgeComponent('./' + snapshot.get('plugin') + '/Sidebar/Details.es6');
}
