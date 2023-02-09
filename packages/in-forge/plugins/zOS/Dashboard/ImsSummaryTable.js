/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import getEntitySnapshotId from 'in-subscription/getEntitySnapshotId';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { fullyQualifiedPlugins } from 'in-forge/constants';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zOS.imsSummary.imsName'),
    type: 'snapshotLink',

    typeArgs: {
      getSnapshotId$(row) {
        var entity = { pluginId: fullyQualifiedPlugins.zIms, host: '', steadyId: row.entityId };
        return getEntitySnapshotId(entity);
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.imsSummary.imsId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.imsSummary.regionCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `IMS_summary.${row.key}.region_count`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.imsSummary.sharedTransactionQueue'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `IMS_summary.${row.key}.shared_transaction_queue`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.imsSummary.longestLock'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `IMS_summary.${row.key}.longest_lock`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.imsSummary.highestR0Time'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `IMS_summary.${row.key}.highest_r0_time`;
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
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'ImsSummaryRawData', props.timeConfig)
    };
  },
  function ImsSummaryTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const imsSummary = data.get('raw_payload');

    if (imsSummary.size === 0) {
      return null;
    }

    const rows = imsSummary.toArray().map(ims => {
      return {
        key: String(ims.get('ims_id')),
        entityId: String(ims.get('entity_id')),
        ims,
        snapshotId,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={t('in-forge:plugins.zOS.imsSummary.title')} cols={cols} rows={rows} />;
  }
);
