/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { number, percentage, bytes } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.unitNumber'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `basicSolidStateDiskMetrics.${row.key}.unitNumber`;
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
        return `basicSolidStateDiskMetrics.${row.key}.aspNumber`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.diskType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.solidStateDiskRawData.get('diskType');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.unitStorageCapacity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `basicSolidStateDiskMetrics.${row.key}.unitStorageCapacity`;
      },
      getContent: bytes.detailed,
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
        return `basicSolidStateDiskMetrics.${row.key}.percentUsed`;
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
      data: getRawPayloadWithTimestamp(snapshotId, 'basicSolidStateDiskRawPayload')
    };
  },
  function BasicSolidStateDiskTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const basicSolidStateDiskRawPayload = data.get('raw_payload');
    if (basicSolidStateDiskRawPayload.size === 0) {
      return null;
    }

    const rows = basicSolidStateDiskRawPayload
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
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmIOs.dashboard.tables.solidStateDisk.name')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={4}
        initialSortDirection="desc"
      />
    );
  }
);
