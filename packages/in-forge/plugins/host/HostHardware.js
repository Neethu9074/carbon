import { fromPromise } from 'reactive-observables';
import React from 'react';

import { getSnapshot, getFoundations } from 'in-stores/snapshot';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { getForgeComponent } from 'in-services/getForgeComponent';
import { alwaysNull } from 'in-services/fixedStreams';
import useObservable from 'in-hooks/useObservable';
import { getSingular } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      foundationSnapshot: getFoundations(props.snapshotId).flatMap(snapshots =>
        snapshots.size > 0 ? getSnapshot(snapshots.first()) : alwaysNull
      )
    };
  },
  function HostHardware({ foundationSnapshot }) {
    const foundationSnapshotPlugin = foundationSnapshot?.get('plugin');
    const Details = useObservable(
      foundationSnapshotPlugin && fromPromise(getForgeComponent(`./${foundationSnapshotPlugin}/Info.js`)),
      [foundationSnapshotPlugin]
    );

    if (!foundationSnapshot || !Details) {
      return null;
    }

    return (
      <div>
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>{getSingular(foundationSnapshot.get('plugin'))}</Collapsible.Header>
          <Collapsible.Content>
            <Details snapshot={foundationSnapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);
