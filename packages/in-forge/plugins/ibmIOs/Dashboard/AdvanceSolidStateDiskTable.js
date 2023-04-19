/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, percentage, bytes } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.resourceName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('resourceName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.unitNumber'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.unitNumber`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.aspNumber'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.aspNumber`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },

  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.serialNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('serialNumber');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdPFAWarning'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('ssdPFAWarning');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdReadWriteProtected'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('ssdReadWriteProtected');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdLifeRemaining'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.ssdLifeRemaining`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdSupportedBytesWritten'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.ssdSupportedBytesWritten`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdBytesWritten'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.ssdBytesWritten`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.ssdPowerOnDays'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.ssdPowerOnDays`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },

  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.percentUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSolidStateDiskMetrics.${row.key}.percentUsed`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'advanceSolidStateDiskRawPayload')
    };
  },
  function AdvancedSolidStateDiskTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const advanceSolidStateDiskRawPayload = data.get('raw_payload');
    if (advanceSolidStateDiskRawPayload.size === 0) {
      return null;
    }

    const rows = advanceSolidStateDiskRawPayload
      .map((solidStateDiskRawData, key) => {
        return {
          key,
          solidStateDiskRawData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')}
        cols={cols}
        rows={rows}
        initialSortColumn={2}
        initialSortDirection="desc"
      />
    );
  }
);
