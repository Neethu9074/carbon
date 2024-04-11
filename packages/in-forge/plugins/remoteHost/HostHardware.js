/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { fromPromise } from '@instana/observables';
import { Collapsible } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { getSnapshot, getFoundations } from 'in-stores/snapshot';
import { getForgeComponent } from 'in-sdk/getForgeComponent';
import { alwaysNull } from 'in-services/fixedStreams';
import { getPluginName } from 'in-sdk/pluginName';
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
          <Collapsible.Header>{getPluginName(foundationSnapshot.get('plugin'), 1)}</Collapsible.Header>
          <Collapsible.Content>
            <Details snapshot={foundationSnapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);

function getDetails([plugin]) {
  return plugin && fromPromise(getForgeComponent(`./${plugin}/Info`));
}
