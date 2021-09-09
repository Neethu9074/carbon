/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TableEntityCounter } from '@instana/components';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { consoleIdUrlParameter } from 'in-zhmc/navigation/urlParameters';
import { getIbmzCpcDashboard } from 'in-zhmc/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import getCpcs from 'in-zhmc/subscriptions/getCpcs';
import { t } from 'in-i18n';

const pathSegment = '/zhmc-cpc';
const matrixPrefix = 'cpc.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-zhmc:name'),
    getContent(item) {
      const consoleId = item.consoleId;
      return <EntityLink label={item.label} href$={getIbmzCpcDashboard(item.id, { consoleId })} />;
    }
  },
  {
    id: 'dpmEnabled',
    label: t('in-zhmc:mode'),
    getContent(item) {
      return item.mode;
    }
  },
  {
    id: 'partitions',
    label: t('in-zhmc:partitions'),
    getContent(item) {
      return <TableEntityCounter count={item.partitions} />;
    }
  },
  {
    id: 'adapters',
    label: t('in-zhmc:adapters'),
    getContent(item) {
      return <TableEntityCounter count={item.adapters} />;
    }
  },
  {
    id: 'ipAddress',
    label: t('in-zhmc:ipAddress'),
    getContent(item) {
      return item.ipAddress;
    }
  },
  {
    id: 'machineTypeModel',
    label: t('in-zhmc:machineTypeModel'),
    getContent(item) {
      return item.machineTypeModel;
    }
  },
  {
    id: 'machineSerial',
    label: t('in-zhmc:machineSerial'),
    getContent(item) {
      return item.machineSerial;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters, consoleIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function ZhmcSystems(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} consoleId={props.consoleId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  consoleId
}) {
  return getCpcs({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      consoleId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
