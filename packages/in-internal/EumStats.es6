import { combineLatest } from 'reactive-observables';
import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import { number } from 'in-services/formatters/number';
import { emptyArray } from 'in-services/fixedObjects';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

export default connectTo(
  {
    us: getSearchResult(`eum-acceptor "us-west-*" entity.selfType:dropwizard`),
    eu: getSearchResult(`eum-acceptor "eu-west-*" entity.selfType:dropwizard`)
  },
  function EumStats({ us, eu }) {
    return (
      <div>
        <CrossRegionStats from="eu-west-1" fromNodes={eu} to="us-west-2" toNodes={us} />
        <CrossRegionStats from="us-west-2" fromNodes={us} to="eu-west-1" toNodes={eu} />
      </div>
    );
  }
);

function CrossRegionStats({ from, to, fromNodes, toNodes }) {
  return (
    <div>
      <h1>Cross region {`${from} => ${to}`}</h1>

      <Columize>
        {toNodes.length > 0 ? (
          <DashboardTile title={`Reads`}>
            <Chart
              snapshotIds={toNodes.map(n => n.dropwizardSnapshotId)}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: toNodes.map(
                  () =>
                    `metrics.meters.com.instana.backend.common.kafka.GenericKafkaConsumerRunnable.retrieved-messages.${
                      to
                    }_eum_spans.${from}`
                ),
                labels: toNodes.map(n => n.hostLabel),
                type: 'stackedArea'
              }}
            />
          </DashboardTile>
        ) : (
          <LoadingIndicator />
        )}

        {fromNodes.length > 0 ? (
          <DashboardTile title={`Writes`}>
            <Chart
              snapshotIds={fromNodes.map(n => n.dropwizardSnapshotId)}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: fromNodes.map(() => `metrics.meters.kafka.writes.by_topic.${to}_eum_spans`),
                labels: fromNodes.map(n => n.hostLabel),
                type: 'stackedArea'
              }}
            />
          </DashboardTile>
        ) : (
          <LoadingIndicator />
        )}
      </Columize>
    </div>
  );
}

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
