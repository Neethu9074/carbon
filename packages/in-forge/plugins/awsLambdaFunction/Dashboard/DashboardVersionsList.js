/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import getVersionsForLambdaFunction from 'in-subscription/getVersionsForLambdaFunction';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    versions: timeConfig$
      .flatMap(timeConfig => getVersionsForLambdaFunction({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
      .debounce(1000)
      .map(snapshots => snapshots.slice().sort(sorter))
  }),
  function DashboardVersionsList({ versions }) {
    if (!versions || versions.length === 0) {
      return null;
    }

    const cols = [
      {
        title: t('in-forge:plugins.awsLambdaFunction.titleVersion'),
        type: 'snapshotLink',
        typeArgs: {
          getSnapshotId(row) {
            return row.key;
          }
        }
      }
    ];

    const rows = versions.map(version => ({ key: version.get('id'), label: version.get('label') }));

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.awsLambdaFunction.titleVersionsCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);

function sorter(a, b) {
  return compareIgnoreCase(getLabel(a), getLabel(b));
}
