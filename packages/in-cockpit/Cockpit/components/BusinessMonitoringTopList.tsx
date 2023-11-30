/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { KeyValue, SvgIcon } from '@instana/components';

import { businessProcessDashboard, summaryTab, businessProcessPath } from 'in-bizops/navigation/paths';
import { getBusinessProcessListData } from 'in-bizops/lists/businessProcess/BusinessProcessList';
import EmptyStateContent from 'in-cockpit/widgets/BusinessMonitoringTopList/EmptyStateContent';
import { businessProcess as businessProcessType } from 'in-cockpit/starredItems/types';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getBusinessProcess from 'in-bizops/subscriptions/getBusinessProcess';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import TopListWidget from 'in-cockpit/widgets/TopListWidget';
import HealthDot from 'in-components/health/HealthDot';
import { number } from 'in-services/formatters/number';
import { add, remove } from 'in-cockpit/starredItems';
import { t } from 'in-i18n';

export default function BusinessMonitoringTopList({ config }) {
  const { location, createHref, createHrefToPath } = useNavigation();

  return (
    <TopListWidget
      {...config}
      getItems={getBusinessProcessListData} // subscription to get data for list
      getItem={getItem}
      pinnedItemTypes={businessProcessType}
      getId={getId}
      pinItem={(id, item) =>
        add({
          id,
          label: item.businessProcess.definitionName,
          type: businessProcessType
        })
      }
      unpinItem={(id, type) => remove({ id, type })}
      columnDefinitions={columnDefinitions}
      getItemLink={item => getItemLink(item, location, createHref)}
      fullListViewLinkTitle={t('in-cockpit:component.bizopsTopList.allProcesses')}
      fullListView={createHrefToPath(businessProcessPath)}
      EmptyStateComponent={EmptyStateContent}
    />
  );
}

function getItem(id, timeConfig) {
  // Have to use the endpoint to fetch ONE process instead of
  // getBusinessProcesses that fetches an ARRAY of processes due
  // to how the StarredItemList works
  return getBusinessProcess({
    timeConfig,
    metrics: {
      started_processes: {
        aggregation: 'DISTINCT_COUNT',
        granularity: getChartGranularity(timeConfig),
        metric: 'bpm_root_process_id'
      }
    },
    definitionId: id
  });
}

function getId(item) {
  return item.businessProcess.definitionId;
}

// Creates a link to the business process clicked by the user
function getItemLink(item, location, createHref) {
  location.pathname = `${businessProcessDashboard}${summaryTab}`;
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionName', item.businessProcess.definitionName);
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionId', item.businessProcess.definitionId);
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'serviceId', item.service.id);

  return createHref(location);
}

const columnDefinitions = [
  {
    width: '2rem', // health dot
    getContent({ item }) {
      return <HealthDot severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)} iconSize={10} />;
    }
  },
  {
    width: '3rem', // bizops icon
    getContent() {
      return <SvgIcon type="lib_bizops" />;
    }
  },
  {
    // no width, scalable column - process name
    getContent({ item }) {
      return (
        <KeyValue
          value={item.businessProcess.definitionName}
          label={t('in-cockpit:component.bizopsTopList.businessProcess')}
          inverted
          accentuated
        />
      );
    }
  },
  {
    width: '12rem', // activities count
    getContent({ item }) {
      return (
        <KeyValue
          value={item.businessProcess.activitiesCount}
          label={t('in-cockpit:component.bizopsTopList.activities')}
          accentuated
        />
      );
    }
  },
  {
    width: '12rem', // started instances spark chart and count
    getContent({ item, result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getChartGranularity(timeConfig)}
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="DISTINCT_COUNT"
          metrics={item.metrics.started_processes}
          metric={item.businessProcess.startedInstancesCount}
          label={t('in-cockpit:component.bizopsTopList.count')}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];
