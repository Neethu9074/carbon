/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getChildOTelDatabases from 'in-subscription/getChildOTelDatabases';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    oTelDatabase: timeConfig$
      .flatMap(timeConfig => getChildOTelDatabases({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
  }),
  function OTelDatabaseList({ oTelDatabase }) {
    if (!oTelDatabase || oTelDatabase.length === 0) {
      return null;
    }

    const cols = [
      {
        title: t('in-forge:plugins.oTelDatabase.instanceId'),
        type: 'snapshotLink',
        typeArgs: {
          getSnapshotId(row) {
            return row.key;
          }
        }
      }
    ];

    const rows = oTelDatabase.map(process => ({ key: process.get('id') }));

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.oTelDatabase.childOTelDatabaseWithCount', {
          len: rows.length
        })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
