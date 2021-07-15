/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getIbmDataPowerServicesForDomain from 'in-subscription/ibmDataPowerDomain/getIbmDataPowerServicesForDomain';
import { number } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.ibmDataPowerService.domainName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.getIn(['data', 'domainName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerService.serviceClass'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.getIn(['data', 'serviceClass']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerService.localIP'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.getIn(['data', 'localIP']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerService.localPort'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.service.getIn(['data', 'localPort']);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerService.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.service.getIn(['data', 'status']);
      }
    }
  }
];

export default connectTo(
  props => ({
    services: timeConfig$
      .flatMap(timeConfig => getIbmDataPowerServicesForDomain({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function ServicesTable({ services, timeConfig }) {
    if (services == null || services.length === 0) {
      return null;
    }

    const rows = services.map(service => {
      return {
        key: service.get('id'),
        service,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmDataPowerDomain.serviceNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
