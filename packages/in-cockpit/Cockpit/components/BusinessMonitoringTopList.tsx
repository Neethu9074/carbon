/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { BizOpsMetricConfiguration, TimeConfig, BusinessProcessItem, Result } from '@instana/types';
import { KeyValue, SvgIcon, ColumnizedDefinition } from '@instana/components';
import { Observable } from '@instana/observables';

// @ts-expect-error Module needs to be translated to TS
import EmptyStateContent from 'in-cockpit/widgets/BusinessMonitoringTopList/EmptyStateContent';
// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
// @ts-expect-error Module needs to be translated to TS
import TopListWidget from 'in-cockpit/widgets/TopListWidget';
// @ts-expect-error Module needs to be translated to TS
import { add, remove } from 'in-cockpit/starredItems';
import { businessProcessDashboard, summaryTab, businessProcessPath } from 'in-bizops/navigation/paths';
import { getBusinessProcessListWithDefaults } from 'in-bizops/subscriptions/getBusinessProcessList';
import { businessProcess as businessProcessType } from 'in-cockpit/starredItems/types';
import getBusinessProcess from 'in-bizops/subscriptions/getBusinessProcess';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import HealthDot from 'in-components/health/HealthDot';
import { number } from 'in-services/formatters/number';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

export default function BusinessMonitoringTopList({ config }: any) {
  const { location, createHref, createHrefToPath } = useNavigation();

  return (
    <TopListWidget
      {...config}
      getItems={getBusinessProcessListWithDefaults} // subscription to get data for list
      getItem={getItem}
      pinnedItemTypes={businessProcessType}
      getId={getId}
      pinItem={(id: string, item: BusinessProcessItem) =>
        add({
          id,
          label: item?.businessProcess?.definitionName,
          type: businessProcessType
        })
      }
      unpinItem={(id: string, type: typeof businessProcessType) => remove({ id, type })}
      columnDefinitions={columnDefinitions}
      getItemLink={(item: BusinessProcessItem) => getItemLink(item, location, createHref)}
      fullListViewLinkTitle={t('in-cockpit:component.bizopsTopList.allProcesses')}
      fullListView={createHrefToPath(businessProcessPath)}
      EmptyStateComponent={EmptyStateContent}
    />
  );
}

function getItem(id: string, timeConfig: TimeConfig): Observable<Result<BusinessProcessItem>> {
  const started_processes: BizOpsMetricConfiguration = {
    metric: 'started_processes',
    granularity: getChartGranularity(timeConfig),
    aggregation: 'DISTINCT_COUNT'
  };

  // Have to use the endpoint to fetch ONE process instead of
  // getBusinessProcesses that fetches an ARRAY of processes due
  // to how the StarredItemList works
  return getBusinessProcess({
    timeConfig,
    metrics: { started_processes: started_processes },
    processDefinitionId: id
  });
}

function getId(item: BusinessProcessItem): string {
  return item?.businessProcess?.definitionId;
}

// Creates a link to the business process clicked by the user
function getItemLink(item: BusinessProcessItem, location: Location, createHref: (target: Location) => string) {
  location.pathname = `${businessProcessDashboard}${summaryTab}`;
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionName', item?.businessProcess?.definitionName);
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionId', item?.businessProcess?.definitionId);
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'serviceId', item?.service?.id);

  return createHref(location);
}

const columnDefinitions: ColumnizedDefinition[] = [
  {
    width: '2rem', // health dot
    getContent({ item }: { item: BusinessProcessItem }) {
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
    getContent({ item }: { item: BusinessProcessItem }) {
      return (
        <KeyValue
          value={item?.businessProcess?.definitionName}
          label={t('in-cockpit:component.bizopsTopList.businessProcess')}
          inverted
          accentuated
        />
      );
    }
  },
  {
    width: '12rem', // activities count
    getContent({ item }: { item: BusinessProcessItem }) {
      return (
        <KeyValue
          value={item?.metrics?.activities_count[0][1]}
          label={t('in-cockpit:component.bizopsTopList.activities')}
          accentuated
        />
      );
    }
  },
  {
    width: '12rem', // started instances spark chart and count
    getContent({
      item,
      result,
      timeConfig
    }: {
      item: BusinessProcessItem;
      result: Result<BusinessProcessItem>;
      timeConfig: TimeConfig;
    }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getChartGranularity(timeConfig)}
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="DISTINCT_COUNT"
          metrics={item?.metrics?.started_processes_array}
          metric={item?.metrics?.started_processes_total?.[0][1]}
          label={t('in-cockpit:component.bizopsTopList.count')}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];
