import React from 'react';
import Region from './Region.es6';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import number from 'in-services/formatters/number';
import { emptyMap, emptyList } from 'in-services/fixedImmutables';

const cols = [
  {
    title: 'Region',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Total Requests',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.regions.${row.key}.tr`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Metadata Requests',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.regions.${row.key}.mr`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Document Count',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.regions.${row.key}.dc`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function RegionsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  var regions = emptyList;
  var collections = emptyList;
  var statusCodes = emptyList;
  var resourceTypes = emptyList;

  var rows = emptyList;

  const regionsMeta = 'meta.regions';
  const collectionsMeta = 'meta.collections';
  const statusCodesMeta = 'meta.statusCodes';
  const resourceTypesMeta = 'meta.resourceTypes';

  snapshot.getIn(['data'], emptyMap).mapKeys(dataKey => {
    if (dataKey.startsWith(regionsMeta)) {
      var regionKey = dataKey.substring(regionsMeta.length + 1);
      if (!regions.has(regionKey)) {
        regions = regions.push(regionKey);
        rows = rows.push({
          key: regionKey,
          name: snapshot.getIn(['data', 'meta.regions.' + regionKey]),
          snapshotId: snapshotId,
          snapshot: snapshot,
          timeConfig: timeConfig
        });
      }
    } else if (dataKey.startsWith(collectionsMeta)) {
      var collectionKey = dataKey.substring(collectionsMeta.length + 1);
      if (!collections.has(collectionKey)) collections = collections.push(collectionKey);
    } else if (dataKey.startsWith(statusCodesMeta)) {
      var statusKey = dataKey.substring(statusCodesMeta.length + 1);
      if (!statusCodes.has(statusKey)) statusCodes = statusCodes.push(statusKey);
    } else if (dataKey.startsWith(resourceTypesMeta)) {
      var resourceKey = dataKey.substring(resourceTypesMeta.length + 1);
      if (!resourceTypes.has(resourceKey)) resourceTypes = resourceTypes.push(resourceKey);
    }
  });

  return (
    <DashboardSection title={`Regions (${rows.size})`}>
      <Table cols={cols} rows={rows.toArray()} getRowDetails={getRowDetails} />
    </DashboardSection>
  );

  function getRowDetails(row) {
    return (
      <Region
        snapshot={snapshot}
        timeConfig={timeConfig}
        region={row.key}
        collections={collections}
        statusCodes={statusCodes}
        resourceTypes={resourceTypes}
      />
    );
  }
}
