import React from 'react';

import { percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import ImageAndLabel from 'in-sdk/components/table/ImageAndLabel';
import { getSingular } from 'in-sdk/pluginName';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: 'Type',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return getSingular(row.snapshot.get('plugin'));
        },
        getContent(pluginName, row) {
          return (
            <ImageAndLabel snapshot={row.snapshot}>
              {pluginName}
            </ImageAndLabel>
          );
        }
      }
    },
    {
      title: 'Name',
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: 'Calls',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'count';
        },
        getContent: zeroDecimalPlaces,
        getTimeWindowAggregation() {
          return 'sum';
        }
      }
    },
    {
      title: 'Avg. Latency',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'duration.mean';
        },
        getContent: msTwoDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: 'Error Rate',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'error_rate';
        },
        getContent: percentageTwoDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: '#Instances',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'instances';
        },
        getContent: zeroDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
