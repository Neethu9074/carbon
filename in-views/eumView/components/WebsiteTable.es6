import React from 'react';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';
import { goToDashboard } from 'in-stores/navigation';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { snapshots$ } from 'in-views/eumView/stores/snapshots';
import { getLabel } from 'in-sdk/snapshot';
import { msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import './WebsiteTable.less';

//todo: use own renderer
const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.label;
      }
    }
  },
  {
    title: 'Page Views',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'count';
      },
      getContent: twoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'adjustedCount';
      }
    }
  },
  {
    title: 'Page Load',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'duration.95th';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Front End Time',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'fro';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Back End Time',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'bac';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'First Paint Time',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'fp';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  () => {
    return {
      snapshots: snapshots$
    };
  },
  function WebsiteTable({ snapshots }) {
    const block = 'in-eum-table';

    if (!snapshots) {
      return <LoadingIndicator type="dark" />;
    }
    let rows = snapshots.map(snapshot => {
      const snapshotId = snapshot.get('id');
      const label = getLabel(snapshot);
      return {
        key: snapshotId,
        label: label,
        snapshotId: snapshotId,
        snapshot
      };
    });

    return (
      <Table
        cols={cols}
        rows={rows}
        onRowClick={row => goToDashboard(row.key)}
        initialSortDirection="asc"
        className={block}
        maxItemsPerPage={Number.MAX_VALUE}
      />
    );
  }
);
