/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getItemsInAvailabilityZone } from 'in-sdk/getItemsInAvailabilityZone';
import { compareIgnoreCase } from 'in-services/util/string';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import Table from 'in-sdk/components/dashboard/Table';
import { getPluginName } from 'in-sdk/pluginName';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      snapshots: getItemsInAvailabilityZone(props.snapshotId).flatMap(snapshotIds => getSnapshots(snapshotIds))
    };
  },
  function ZoneItemsTable({ snapshots }) {
    if (snapshots == null || snapshots.length === 0) {
      return null;
    }

    const groups = getSnapshotsGroupedByPlugin(snapshots);
    const groupPlugins = Object.keys(groups).sort((a, b) =>
      compareIgnoreCase(getPluginName(a, groups[a].length), getPluginName(b, groups[b].length))
    );

    let tables = [];
    groupPlugins.map(plugin => {
      let cols = [];
      cols.push({
        title: t('in-forge:plugins.genericZone.dashboard.name'),
        type: 'snapshotLink',
        typeArgs: {
          getSnapshotId(row) {
            return row.key;
          }
        }
      });

      const kpiDefinitions = getKpiDefinitions(plugin);
      kpiDefinitions?.map(kpiDefinition => {
        cols.push({
          title: kpiDefinition.label,
          type: 'metric',
          typeArgs: {
            getSnapshotId(row) {
              return row.key;
            },
            getMetricName() {
              return kpiDefinition.metric;
            },
            getContent(value) {
              return kpiDefinition?.formatter(value) || value;
            },
            getTimeWindowAggregation() {
              return 'mean';
            }
          }
        });
      });

      cols.push({
        title: t('in-forge:plugins.genericZone.dashboard.health'),
        type: 'health',
        typeArgs: {
          getSnapshotId(row) {
            return row.key;
          }
        }
      });

      let rows = [];
      groups[plugin]
        .sort((snapshotA, snapshotB) => compareIgnoreCase(getLabel(snapshotA), getLabel(snapshotB)))
        .map(snapshot => {
          rows.push({
            key: snapshot.get('id')
          });
        });

      tables.push(
        <Table
          withoutPadding
          cardTitle={`${getPluginName(plugin, groups[plugin].length)} (${groups[plugin].length})`}
          cols={cols}
          rows={rows}
          maxItemsPerPage={10}
        />
      );
    });

    return <div>{tables}</div>;
  }
);

function getSnapshotsGroupedByPlugin(snapshots) {
  const snapshotsByPlugin = {};

  snapshots.forEach(snapshot => {
    const plugin = snapshot.get('plugin');
    if (!(plugin in snapshotsByPlugin)) {
      snapshotsByPlugin[plugin] = [];
    }

    snapshotsByPlugin[plugin].push(snapshot);
  });

  return snapshotsByPlugin;
}
