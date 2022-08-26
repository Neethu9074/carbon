/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import getFunctionsForFunctionApp from 'in-forge/plugins/azureFunctionApp/subscriptions/getFunctionsForFunctionApp';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureFunctionApp.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureFunctionApp.dashboard.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'type']);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureFunctionApp.dashboard.location'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'location']);
      }
    }
  }
];

export default connectTo(
  props => ({
    functions: timeConfig$
      .flatMap(timeConfig => getFunctionsForFunctionApp({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function FunctionsTable({ functions, timeConfig }) {
    if (functions == null || functions.length === 0) {
      return null;
    }

    const rows = functions.map(func => {
      const id = func.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: func,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.azureFunctionApp.dashboard.functionsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
