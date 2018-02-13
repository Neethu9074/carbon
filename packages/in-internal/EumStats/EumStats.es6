import { combineLatest } from 'reactive-observables';
import React from 'react';

import CrossRegionStats from 'in-internal/EumStats/CrossRegionStats';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import EumAcceptors from 'in-internal/EumStats/EumAcceptors';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyArray } from 'in-services/fixedObjects';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    us: getSearchResult(`eum-acceptor "us-west-*" entity.selfType:dropwizard`),
    eu: getSearchResult(`eum-acceptor "eu-west-*" entity.selfType:dropwizard`)
  },
  function EumStats({ us, eu }) {
    return (
      <div style={{ margin: '1rem' }}>
        <CrossRegionStats from="eu-west-1" fromNodes={eu} to="us-west-2" toNodes={us} />
        <CrossRegionStats from="us-west-2" fromNodes={us} to="eu-west-1" toNodes={eu} />
        <EumAcceptors region="us-west-2" nodes={us} />
        <EumAcceptors region="eu-west-1" nodes={eu} />
      </div>
    );
  }
);

function getSearchResult(query) {
  return combineLatest([timeframe$, focusedMoment$])
    .flatMap(([timeframe, focusedMoment]) =>
      search({
        query,
        time: focusedMoment,
        view: 'TABLE',
        timeframe
      })
        .flatMap(getSnapshots, focusedMoment)
        .flatMap(dropwizardSnapshots => {
          return combineLatest(dropwizardSnapshots.map(getHostSnapshotId))
            .flatMap(getSnapshots)
            .map(hosts => hosts.filter(h => !!h))
            .map(hosts => {
              return hosts.map(host => ({
                hostLabel: host.get('label'),
                hostSnapshotId: host.get('id'),
                dropwizardSnapshotId: dropwizardSnapshots
                  .find(s => s.getIn(['entityId', 'host']) === host.getIn(['entityId', 'host']))
                  .get('id')
              }));
            });
        })
        .map(n => n.slice().sort((a, b) => compareIgnoreCase(a.hostLabel, b.hostLabel)))
        .distinct((a, b) => JSON.stringify(a) !== JSON.stringify(b))
    )
    .startWith(emptyArray);
}
