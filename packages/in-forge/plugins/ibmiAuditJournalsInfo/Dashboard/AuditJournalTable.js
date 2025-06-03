/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
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
    title: t('in-forge:plugins.ibmiAuditJournalsInfo.dashboard.tables.auditJournals.entryType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.auditJournalInfoStringData.get('entryTypeName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiAuditJournalsInfo.dashboard.tables.auditJournals.entryTypeDetail'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.auditJournalInfoStringData.get('entryTypeDetail');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiAuditJournalsInfo.dashboard.tables.auditJournals.entryCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `auditJournalMetrics.${row.key}.entryCount`;
      },
      getContent: number.compact,
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
      data: getRawPayloadWithTimestamp(snapshotId, 'auditJournalRawPayload')
    };
  },
  function auditJournalTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const auditJournalRawPayload = data.get('raw_payload');
    if (auditJournalRawPayload.size === 0) {
      return null;
    }

    const rows = auditJournalRawPayload
      .map((auditJournalInfoStringData, key) => {
        return {
          key,
          auditJournalInfoStringData,
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
            title={t('in-forge:plugins.ibmiAuditJournalsInfo.dashboard.tables.auditJournals.name')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={2}
        initialSortDirection="desc"
      />
    );
  }
);
