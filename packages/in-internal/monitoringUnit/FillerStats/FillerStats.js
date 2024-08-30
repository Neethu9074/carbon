/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';
import { Button } from '@instana/components';

import FillerStatsRow, { DROPWIZARD_STATS } from 'in-internal/monitoringUnit/FillerStats/FillerStatsRow';
import { getSnapshotFromPhysicalHierarchyByPlugin } from 'in-stores/snapshot';
import { emptyArray } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    fillerSnapshotsUS: searchFillerSnapshots(`entity.zone:*US* entity.label:*filler* entity.selfType:dropwizard`),
    fillerSnapshotsEU: searchFillerSnapshots(`entity.zone:*EU* entity.label:*filler* entity.selfType:dropwizard`),
    esClusterSnapshotUS: searchEsClusterSnapshot(`entity.elasticsearch.cluster.name:*traces*us*`),
    esClusterSnapshotEU: searchEsClusterSnapshot(`entity.elasticsearch.cluster.name:*traces*eu*`),
    cassandraClusterSnapshotUS: searchCassandraClusterSnapshot(`entity.cassandra.cluster.name:*spans*us*`),
    cassandraClusterSnapshotEU: searchCassandraClusterSnapshot(`entity.cassandra.cluster.name:*spans*eu*`)
  },
  class FillerStats extends React.Component {
    state = {
      region: null
    };

    render() {
      const {
        fillerSnapshotsEU,
        fillerSnapshotsUS,
        esClusterSnapshotUS,
        esClusterSnapshotEU,
        cassandraClusterSnapshotUS,
        cassandraClusterSnapshotEU,
        timeConfig
      } = this.props;
      const { region } = this.state;

      let snapshots = [];
      let esSnapshotId = null;
      let cassandraSnapshotId = null;
      if (region == 'EU') {
        snapshots = fillerSnapshotsEU;
        esSnapshotId = esClusterSnapshotEU;
        cassandraSnapshotId = cassandraClusterSnapshotEU;
      }
      if (region == 'US') {
        snapshots = fillerSnapshotsUS;
        esSnapshotId = esClusterSnapshotUS;
        cassandraSnapshotId = cassandraClusterSnapshotUS;
      }

      return (
        <div>
          <h2>{t('in-internal:monitoringUnit.fillerStats.selectARegionToLoadTheFillerStats')}</h2>
          <Button onClick={() => this.handleButtonClick('EU')}>EU</Button>
          <Button onClick={() => this.handleButtonClick('US')}>US</Button>

          <div>
            Region; snapshotId; label;
            {DROPWIZARD_STATS.map(stat => `${stat.label} (avg)`).join(';')};
            {DROPWIZARD_STATS.map(stat => `${stat.label} (top)`).join(';')}; ES Index size; Cassandra disk size (total
            avg);
          </div>

          {snapshots.map(snapshot => (
            <FillerStatsRow
              key={snapshot.id}
              region={region}
              snapshotId={snapshot.id}
              esSnapshotId={esSnapshotId}
              cassandraSnapshotId={cassandraSnapshotId}
              tuName={snapshot.label.substr(0, snapshot.label.lastIndexOf('-'))}
              timeConfig={timeConfig}
            />
          ))}
        </div>
      );
    }

    handleButtonClick(region) {
      this.setState({ region });
    }
  }
);

function searchFillerSnapshots(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query,
        view: 'TABLE',
        timeConfig
      })
        .flatMap(getSnapshots, timeConfig)
        .flatMap(dropwizardSnapshots => {
          return combineLatest(
            dropwizardSnapshots.map(dropwizardSnapshot =>
              getSnapshotFromPhysicalHierarchyByPlugin(dropwizardSnapshot.get('id'), 'docker').map(dockerSnapshot => ({
                dropwizardSnapshot,
                dockerSnapshot
              }))
            )
          ).map(results => {
            return results.map(result => {
              return {
                id: result.dropwizardSnapshot.get('id'),
                label: result.dockerSnapshot.getIn(['data', 'Nomad', 'jobName'])
              };
            });
          });
        })
    )
    .startWith(emptyArray);
}

function searchEsClusterSnapshot(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query,
        view: 'TABLE',
        timeConfig
      })
        .map(ids => ids.toJS()[0])
        .flatMap(nodeId => getSnapshotFromPhysicalHierarchyByPlugin(nodeId, 'elasticsearchCluster'))
        .map(esClusterSnapshot => esClusterSnapshot.get('id'))
    )
    .startWith(null);
}

function searchCassandraClusterSnapshot(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query,
        view: 'TABLE',
        timeConfig
      })
        .map(ids => ids.toJS()[0])
        .flatMap(nodeId => getSnapshotFromPhysicalHierarchyByPlugin(nodeId, 'cassandraCluster'))
        .map(cassandraClusterSnapshot => cassandraClusterSnapshot.get('id'))
    )
    .startWith(null);
}
