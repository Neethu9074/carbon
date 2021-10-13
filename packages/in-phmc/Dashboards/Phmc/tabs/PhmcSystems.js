/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TableEntityCounter } from '@instana/components';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { consoleIdUrlParameter } from 'in-phmc/navigation/urlParameters';
import { getIbmpSystemDashboard } from 'in-phmc/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import getSystems from 'in-phmc/subscriptions/getSystems';
import { t } from 'in-i18n';

const pathSegment = '/phmc-system';
const matrixPrefix = 'system.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-phmc:name'),
    getContent(item) {
      return <EntityLink label={item.label} href$={getIbmpSystemDashboard(item.id)} />;
    }
  },
  {
    id: 'partitions',
    label: t('in-phmc:partitions'),
    getContent(item) {
      return <TableEntityCounter count={item.partitions} />;
    }
  },
  {
    id: 'machineTypeModel',
    label: t('in-phmc:machineTypeModel'),
    getContent(item) {
      return item.machineTypeModel;
    }
  },
  {
    id: 'machineSerial',
    label: t('in-phmc:machineSerial'),
    getContent(item) {
      return item.machineSerial;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters, consoleIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});
export default function PhmcSystem(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} consoleId={props.consoleId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  datacenterId
}) {
  return getSystems({
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
      datacenterId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
