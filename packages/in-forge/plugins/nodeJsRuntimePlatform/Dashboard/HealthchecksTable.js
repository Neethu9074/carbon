/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { yesOrNo } from 'in-services/formatters/boolean';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.nodeJsRuntimePlatform.healthCheck'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.nodeJsRuntimePlatform.healthy'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `healthcheck.${row.name}.healthy`;
      },
      getContent: yesOrNo,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.nodeJsRuntimePlatform.since'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `healthcheck.${row.name}.since`;
      },
      getContent(since) {
        return `${formatDateTime(since)} (${fromNowAccurately(since)})`;
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function HealthchecksTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'healthchecks'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        name,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.nodeJsRuntimePlatform.healthChecksWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      maxItemsPerPage={20}
    />
  );
}
