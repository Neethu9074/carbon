import { fromPromise } from '@instana/observables';
import React from 'react';

import { getForgeComponent } from 'in-services/getForgeComponent';
import { getSnapshot, getFoundations } from 'in-stores/snapshot';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
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
    const Details = useObservable(getDetails, [foundationSnapshot?.get('plugin')]);
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

function getDetails([plugin]) {
  return plugin && fromPromise(getForgeComponent(`./${plugin}/Info.js`));
}
