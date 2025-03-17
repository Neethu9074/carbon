/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  PaginatedResult,
  Result,
  TagFilterExpression,
  TimeConfig,
  WebsitePaginatedBeaconGroupsItem
} from '@instana/types';
import { CarbonLayer } from '@instana/components';

import {
  getEventName,
  getMetricCount,
  getTableData
} from 'in-alerting/smart-alerts/websites/components/customEventsUtil';
import { joinExpressions, FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import CustomEventRow from 'in-alerting/smart-alerts/websites/components/CustomEventRow';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import List from 'in-settings/components/List';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/CustomEventsList.mless';

interface WebsiteAggType {
  [index: string]: number[][];
}

const columnDefinitions = [
  {
    id: 'name',
    width: '60',
    label: t('in-alerting:smartAlerts.websites.customEvent.customEventNameColumnLabel'),
    getContent: (item: WebsitePaginatedBeaconGroupsItem) => <CustomEventRow item={item} />
  },
  {
    id: 'occurrencesAgg',
    width: '20',
    label: t('in-alerting:smartAlerts.websites.customEvent.customEventOccurrencesColumnLabel'),
    getValue: (item: WebsitePaginatedBeaconGroupsItem) =>
      getMetricCount(item.metrics.occurrencesAgg as unknown as WebsiteAggType),
    getContent: (item: WebsitePaginatedBeaconGroupsItem) => (
      <MetricValue value={getMetricCount(item.metrics.occurrencesAgg as unknown as WebsiteAggType, true)} />
    )
  },
  {
    id: 'usersAgg',
    width: '20',
    label: t('in-alerting:smartAlerts.websites.customEvent.customEventUsersColumnLabel'),
    getValue: (item: WebsitePaginatedBeaconGroupsItem) =>
      getMetricCount(item.metrics.usersAgg as unknown as WebsiteAggType),
    getContent: (item: WebsitePaginatedBeaconGroupsItem) => (
      <MetricValue value={getMetricCount(item.metrics.usersAgg as unknown as WebsiteAggType, true)} />
    )
  }
];

interface CustomEventsListProps {
  websiteId: string;
  tagFilterExpression: FormModelElement | FormModelElement[];
  timeConfig: TimeConfig;
  onCustomEventSelect: (arg: string) => void;
  slideOut: () => void;
}

export default function CustomEventsList({
  websiteId,
  tagFilterExpression,
  timeConfig,
  onCustomEventSelect,
  slideOut
}: CustomEventsListProps) {
  const expression = joinExpressions({
    logicalOperator: and,
    expressions: [
      tagFilter('beacon.website.id', 'EQUALS', websiteId),
      tagFilter('beacon.type', 'EQUALS', 'custom'),
      tagFilterExpression
    ]
  });

  return (
    <CarbonLayer>
      <List
        key={Math.random()}
        getCustomHeader={() => (
          <Label className={locals.customEventListInfo}>
            {t('in-alerting:smartAlerts.websites.customEvent.customEventListInfoLabel')}
          </Label>
        )}
        searchAttributes={[entity => entity.name]}
        searchPlaceholder={t('in-alerting:smartAlerts.websites.customEvent.searchCustomEvents')}
        searchMaxWidth={250}
        getEntityName={config => config.name}
        columnDefinitions={columnDefinitions}
        loadEntities={() =>
          getTableData({
            tagFilterExpression: toBackendQueryModel(expression) as TagFilterExpression,
            timeConfig
          })
            .filter(tableData => Boolean(tableData.data))
            .map(
              (tableData: Result<PaginatedResult<WebsitePaginatedBeaconGroupsItem>>) =>
                (tableData.data as PaginatedResult<WebsitePaginatedBeaconGroupsItem>)?.items
            )
        }
        pageSize={10}
        noDataMessage={t('in-alerting:smartAlerts.websites.customEvent.noCustomEventsFound')}
        onRowClick={item => {
          onCustomEventSelect(getEventName(item));
          slideOut();
        }}
        isSearchable
      />
    </CarbonLayer>
  );
}
