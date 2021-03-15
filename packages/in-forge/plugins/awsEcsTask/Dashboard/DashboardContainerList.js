/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getEcsContainersForEcsTask from 'in-subscription/getEcsContainersForEcsTask';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    containers: timeConfig$
      .flatMap(timeConfig => getEcsContainersForEcsTask({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
      .debounce(1000)
      .map(snapshots => snapshots.slice().sort(sorter))
  }),
  function DashboardContainerList({ containers }) {
    if (!containers || containers.length === 0) {
      return null;
    }

    const cols = [
      {
        title: t('in-forge:plugins.awsEcsTask.titleContainer'),
        type: 'snapshotLink',
        typeArgs: {
          getSnapshotId(row) {
            return row.key;
          }
        }
      }
    ];

    const rows = containers.map(container => ({ key: container.get('id'), label: container.get('label') }));

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.awsEcsTask.titleContainersCounts', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);

function sorter(a, b) {
  return compareIgnoreCase(getLabel(a), getLabel(b));
}
