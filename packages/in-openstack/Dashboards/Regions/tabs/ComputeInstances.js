/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getOpenstackInstances from 'in-openstack/subscriptions/getOpenstackInstances';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getOpenstackInstanceDashboard } from 'in-openstack/navigation/paths';
import { regionIdUrlParameter } from 'in-openstack/navigation/urlParameters';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const pathSegment = '/openstack-instances';
const matrixPrefix = 'instance.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-openstack:dashboards.name'),
    getContent(item) {
      const regionId = item.regionId;
      return <EntityLink label={item.label} href$={getOpenstackInstanceDashboard(item.id, { regionId })} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.openstackHypervisor,
    title: t('in-openstack:dashboards.noDataAvailable.hypervisorTitle'),
    description: t('in-openstack:dashboards.noDataAvailable.hypervisorDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, regionIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function ComputeInstances(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} regionId={props.regionId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  regionId
}) {
  return getOpenstackInstances({
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
      regionId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
