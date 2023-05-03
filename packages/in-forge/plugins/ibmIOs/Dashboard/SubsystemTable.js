/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.subsystemName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subsystemStringData.get('subsystemName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.libraryName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subsystemStringData.get('libraryName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.activeJobs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `subsystemMetrics.${row.key}.activeJobs`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.maxActiveJobs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `subsystemMetrics.${row.key}.maxActiveJobs`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.description'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subsystemStringData.get('description');
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'subSystemRawPayload')
    };
  },
  function subsystemTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const subSystemRawPayload = data.get('raw_payload');
    if (subSystemRawPayload.size === 0) {
      return null;
    }
    const rows = subSystemRawPayload
      .map((subsystemStringData, key) => {
        return {
          key,
          subsystemStringData,
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
            title={t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.name')}
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
