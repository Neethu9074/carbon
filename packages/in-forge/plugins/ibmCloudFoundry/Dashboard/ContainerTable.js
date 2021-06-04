/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Range } from 'immutable';
import React from 'react';

import { millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudFoundry.instanceID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFoundry.age'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `instances.${row.name}.app_container_age`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ContainerTable({ snapshot, timeConfig, instanceCount }) {
  if (!instanceCount || instanceCount < 1) {
    return null;
  }

  const rows = Range(1, instanceCount + 1)
    .toArray()
    .map(instanceNumber => {
      return {
        key: String(instanceNumber),
        name: String(instanceNumber),
        instanceNumber,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmCloudFoundry.titleContainer')}
      cols={cols}
      rows={rows}
      initialSortColumn={1}
      initialSortDirection="desc"
      maxItemsPerPage={10}
    />
  );
}
