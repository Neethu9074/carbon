/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import getIbmDataPowerDomainsForAppliance from 'in-subscription/ibmDataPowerAppliance/getIbmDataPowerDomainsForAppliance';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.quiesceState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.domain.getIn(['data', 'quiesceState']);
      }
    }
  }
];

export default connectTo(
  props => ({
    domains: timeConfig$
      .flatMap(timeConfig => getIbmDataPowerDomainsForAppliance({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function DomainsTable({ domains, timeConfig }) {
    if (domains == null || domains.length === 0) {
      return null;
    }

    const rows = domains.map(domain => {
      return {
        key: domain.get('id'),
        domain,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmDataPowerAppliance.domainsNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
