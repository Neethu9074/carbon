/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getIbmDataPowerSqlDatasourcesForDomain from 'in-subscription/ibmDataPowerDomain/getIbmDataPowerSqlDatasourcesForDomain';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerDomain.domainName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sqlDatasource.getIn(['data', 'domainName']);
      }
    }
  }
];

export default connectTo(
  props => ({
    sqlDatasources: timeConfig$
      .flatMap(timeConfig =>
        getIbmDataPowerSqlDatasourcesForDomain({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
      .flatMap(getSnapshots)
  }),

  function SqlDatasourcesTable({ sqlDatasources, timeConfig }) {
    if (sqlDatasources == null || sqlDatasources.length === 0) {
      return null;
    }

    const rows = sqlDatasources.map(sqlDatasource => {
      return {
        key: sqlDatasource.get('id'),
        sqlDatasource,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmDataPowerDomain.sqlDatasourceNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
