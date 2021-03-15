/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getChildProcesses from 'in-subscription/getChildProcesses';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    processes: timeConfig$
      .flatMap(timeConfig => getChildProcesses({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
  }),
  function ProcessList({ processes }) {
    if (!processes || processes.length === 0) {
      return null;
    }

    const cols = [
      {
        title: t('in-forge:plugins.process.name'),
        type: 'snapshotLink',
        typeArgs: {
          getSnapshotId(row) {
            return row.key;
          }
        }
      }
    ];

    const rows = processes.map(process => ({ key: process.get('id') }));

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.process.childProcessesWithCount', {
          count: rows.length
        })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
