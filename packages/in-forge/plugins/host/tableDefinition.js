/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import ImageAndLabel from 'in-sdk/components/table/ImageAndLabel';
import { getFoundations, getSnapshot } from 'in-stores/snapshot';
import { compareIgnoreCase } from 'in-services/util/string';
import { alwaysNull } from 'in-services/fixedStreams';
import { getZone } from 'in-stores/zone';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 1,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.host.zone'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getZone(row.snapshotId);
        }
      }
    },
    {
      title: t('in-forge:plugins.host.name'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.host.hostname'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'hostname']);
        }
      }
    },
    {
      title: t('in-forge:plugins.host.os'),
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
      title: t('in-forge:plugins.host.type'),
      type: 'custom',
      typeArgs: {
        comparator: compareIgnoreCase,
        get$(row) {
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
      title: t('in-forge:plugins.host.cpUs'),
      type: 'number',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'cpu.count']);
        },
        getContent: zeroDecimalPlaces
      }
    },
    {
      title: t('in-forge:plugins.host.cpuUsage'),
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
      title: t('in-forge:plugins.host.memory'),
      type: 'number',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'memory.total']);
        },
        getContent: bytesTwoDecimalPlaces
      }
    },
    {
      title: t('in-forge:plugins.host.memoryUsed'),
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
  ]
};
