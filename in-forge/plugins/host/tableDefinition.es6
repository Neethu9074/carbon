import React from 'react';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import ImageAndLabel from 'in-sdk/components/table/ImageAndLabel';
import { getFoundations, getSnapshot } from 'in-stores/snapshot';
import { compareIgnoreCase } from 'in-services/util/string';
import { alwaysNull } from 'in-services/fixedStreams';
import { getZone } from 'in-stores/zone';

export default [
  {
    title: 'Zone',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId$(row) {
        return getZone(row.snapshotId);
      }
    }
  },
  {
    title: 'FQDN',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: 'Hostname',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'hostname']);
      }
    }
  },
  {
    title: 'OS',
    type: 'string',
    typeArgs: {
      getValue(row) {
        const data = row.snapshot.get('data');
        return `${data.get('os.name', '')} ${data.get('os.version', '')} (${data.get('os.arch', '')})`;
      },
      getContent(val, row) {
        const data = row.snapshot.get('data');
        return (
          <ImageAndLabel snapshot={row.snapshot}>
            {data.get('os.version', '')} ({data.get('os.arch', '')})
          </ImageAndLabel>
        );
      }
    }
  },
  {
    title: 'Type',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        return getFoundations(row.snapshotId)
          .flatMap(foundations => {
            if (foundations.size === 0) {
              return alwaysNull;
            }
            return getSnapshot(foundations.first());
          })
          .map(foundationSnapshot => {
            if (!foundationSnapshot) {
              return null;
            }

            const instanceType = foundationSnapshot.getIn(['data', 'instance-type']) || '';
            return {
              value: instanceType,
              content: instanceType
            };
          });
      }
    }
  },
  {
    title: '#CPUs',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'cpu.count']);
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: 'CPU Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.used';
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'memory.total']);
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: 'Memory Used',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'memory.used';
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
