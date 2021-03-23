/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromPromise } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import React from 'react';

import { getForgeComponent } from 'in-services/getForgeComponent';
import { getSnapshot, getFoundations } from 'in-stores/snapshot';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
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
  return plugin && fromPromise(getForgeComponent(`./${plugin}/Info.js`));
}
