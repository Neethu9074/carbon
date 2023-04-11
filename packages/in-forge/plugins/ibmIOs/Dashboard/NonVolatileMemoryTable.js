/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { number, percentage } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.resourceName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.nonVolatileMemoryRawPayload.get('resourceName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.hardwareModelNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.nonVolatileMemoryRawPayload.get('hardwareModelNumber');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.lifeRemaining'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.lifeRemaining`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.spareCapacity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.spareCapacity`;
      },
      getContent: percentage,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.spareCapacityThreshold'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.spareCapacityThreshold`;
      },
      getContent: percentage,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.namespaceAvailable'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.namespaceAvailable`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.namespaceUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.namespaceUsed`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.powerCycles'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.powerCycles`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.powerOnHours'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.powerOnHours`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.mediaErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.mediaErrors`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.unSafeShutDowns'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.unSafeShutDowns`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.compositeTemperature'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nonVolatileMemoryMetrics.${row.key}.compositeTemperature`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.firmwareLevel'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.nonVolatileMemoryRawPayload.get('firmwareLevel');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.serialNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.nonVolatileMemoryRawPayload.get('serialNumber');
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'nonVolatileMemoryRawPayload')
    };
  },
  function NonVolatileMemoryTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const nonVolatileMemoryRawPayload = data.get('raw_payload');
    if (nonVolatileMemoryRawPayload.size === 0) {
      return null;
    }

    const rows = nonVolatileMemoryRawPayload
      .map((nonVolatileMemoryRawData, key) => {
        return {
          key,
          nonVolatileMemoryRawData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmIOs.dashboard.tables.nonVolatileMemory.name')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={6}
        initialSortDirection="desc"
      />
    );
  }
);
