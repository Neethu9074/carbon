/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MobileAppPaginatedBeaconGroupsItem, Result, TagFilterExpression, TimeConfig } from '@instana/types';
import { CarbonLayer } from '@instana/components';

import {
  getEventName,
  getMetricCount,
  getTableData
} from 'in-alerting/smart-alerts/mobileApp/components/customEventsUtil';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import CustomEventRow from 'in-alerting/smart-alerts/mobileApp/components/CustomEventRow';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import List from 'in-settings/components/List';
import Label from 'in-components/form/Label';
import { PaginatedResult } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/mobileApp/components/CustomEventsList.mless';

interface MobileAppAggType {
  [index: string]: number[][];
}

const columnDefinitions = [
  {
    id: 'name',
    width: '60',
    label: t('in-alerting:smartAlerts.mobileApp.customEvent.customEventNameColumnLabel'),
    getContent: (item: MobileAppPaginatedBeaconGroupsItem) => {
      return <CustomEventRow item={item} />;
    }
  },
  {
    id: 'occurrencesAgg',
    width: '20',
    label: t('in-alerting:smartAlerts.mobileApp.customEvent.customEventOccurrencesColumnLabel'),
    getValue: (item: MobileAppPaginatedBeaconGroupsItem) =>
      getMetricCount(item.metrics.occurrencesAgg as unknown as MobileAppAggType),
    getContent: (item: MobileAppPaginatedBeaconGroupsItem) => (
      <MetricValue value={getMetricCount(item.metrics.occurrencesAgg as unknown as MobileAppAggType, true)} />
    )
  },
  {
    id: 'usersAgg',
    width: '20',
    label: t('in-alerting:smartAlerts.mobileApp.customEvent.customEventUsersColumnLabel'),
    getValue: (item: MobileAppPaginatedBeaconGroupsItem) =>
      getMetricCount(item.metrics.usersAgg as unknown as MobileAppAggType),
    getContent: (item: MobileAppPaginatedBeaconGroupsItem) => (
      <MetricValue value={getMetricCount(item.metrics.usersAgg as unknown as MobileAppAggType, true)} />
    )
  }
];

interface CustomEventsListProps {
  mobileAppId: string;
  tagFilterExpression: FormModelElement | FormModelElement[] | TagFilterExpression;
  timeConfig: TimeConfig;
  onCustomEventSelect: (arg: string) => void;
  slideOut: () => void;
}

export default function CustomEventsList({
  mobileAppId,
  tagFilterExpression,
  timeConfig,
  onCustomEventSelect,
  slideOut
}: CustomEventsListProps) {
  const expression = joinExpressions({
    logicalOperator: and,
    expressions: [
      tagFilter('mobileBeacon.mobileApp.id', 'EQUALS', mobileAppId),
      tagFilter('mobileBeacon.type', 'EQUALS', 'custom'),
      tagFilterExpression as FormModelElement | FormModelElement[]
    ]
  });

  return (
    <CarbonLayer>
      <List
        key={Math.random()}
        getCustomHeader={() => (
          <Label className={locals.customEventListInfo}>
            {t('in-alerting:smartAlerts.mobileApp.customEvent.customEventListInfoLabel')}
          </Label>
        )}
        searchAttributes={[entity => entity.name]}
        searchPlaceholder={t('in-alerting:smartAlerts.mobileApp.customEvent.searchCustomEvents')}
        searchMaxWidth={250}
        getEntityName={config => config.name}
        columnDefinitions={columnDefinitions}
        loadEntities={() =>
          getTableData({
            tagFilterExpression: toBackendQueryModel(expression) as TagFilterExpression,
            timeConfig
          })
            .filter((tableData: Result<PaginatedResult<MobileAppPaginatedBeaconGroupsItem>>) => !!tableData.data)
            .map((tableData: Result<PaginatedResult<MobileAppPaginatedBeaconGroupsItem>>) => tableData.data!.items)
        }
        pageSize={10}
        noDataMessage={t('in-alerting:smartAlerts.mobileApp.customEvent.noCustomEventsFound')}
        onRowClick={item => {
          onCustomEventSelect(getEventName(item));
          slideOut();
        }}
        isSearchable
      />
    </CarbonLayer>
  );
}
