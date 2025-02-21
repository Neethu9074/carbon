/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { consoleIdUrlParameter } from 'in-phmc/navigation/urlParameters';
import { percentage, number } from 'in-services/formatters/number';
import { useIbmpSystemDashboard } from 'in-phmc/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import getSystems from 'in-phmc/subscriptions/getSystems';
import { t } from 'in-i18n';

const pathSegment = '/phmc-system';
const matrixPrefix = 'system.';

function EntityLinkLabel({ item }) {
  const getIbmpSystemDashboard = useIbmpSystemDashboard();

  return <EntityLink label={item.label} href={getIbmpSystemDashboard(item.id, { consoleId: item.consoleId })} />;
}

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-phmc:name'),
    getContent(item) {
      return <EntityLinkLabel item={item} />;
    }
  },
  {
    id: 'partitions',
    label: t('in-phmc:partitions'),
    getContent(item) {
      return item.partitions;
    }
  },
  {
    id: 'vios',
    label: t('in-phmc:vios'),
    getContent(item) {
      return item.vios;
    }
  },
  {
    id: 'utilizedProcUnits',
    label: t('in-phmc:utilizedProcNumber'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="utilizedProcUnits"
        />
      );
    }
  },
  {
    id: 'utilizedProcUnitsPercent',
    label: t('in-phmc:utilizedProc'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="utilizedProcUnitsPercent"
        />
      );
    }
  },
  {
    id: 'availableMem',
    label: t('in-phmc:memAvailable'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="availableMem"
        />
      );
    }
  },
  {
    id: 'availableMemPercentage',
    label: t('in-phmc:memAvailablePercentage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="availableMemPercentage"
        />
      );
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
  defaultOrderBy: 'label',
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
  consoleId
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
      consoleId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
