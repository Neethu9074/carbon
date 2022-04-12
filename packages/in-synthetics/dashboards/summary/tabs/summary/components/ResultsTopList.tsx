/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

//import { get } from 'lodash';
import React from 'react';

import { Link } from '@instana/components';

//import { TestResponse } from 'in-synthetics/utils/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
// @ts-ignore
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
// @ts-ignore
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { latency, number } from 'in-services/formatters/number';
import { Order, TagFilter, TimeConfig } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

const metrics = ['response_time', 'finish_time', 'status'];
const metricInPayload = new Map<string, string>([
  ['response_time', 'response_time'],
  ['finish_time', 'finish_time'],
  ['status', 'finish_time']
]);
const orders = new Map<string, Order>([
  ['response_time', { by: 'response_time', direction: 'DESC' }],
  ['finish_time', { by: 'finish_time', direction: 'DESC' }],
  ['status', { by: 'finish_time', direction: 'DESC' }]
]);

const labels = [
  t('in-synthetics:dashboard.summary.widgets.slowest'),
  t('in-synthetics:dashboard.summary.widgets.latest'),
  t('in-synthetics:dashboard.summary.widgets.failed')
];
const formatters = [latency.compact, number.compact, number.compact];
const companionMetrics = [null, null, null];
const companionFormatters = [null, null, null];
const colors = [null, null, theme.lib.colors.failure];

type Props = {
  testId: string;
};

export default function ResultsTopList({ testId }: Props) {
  const timeConfig = useTimeConfig();

  const urlMatrixParamConfig = {
    paramTab: 'resultsTab',
    path: '/summary'
  };

  return (
    <TopListWithUrlState
      metrics={metrics}
      title={t('in-synthetics:dashboard.summary.widgets.results')}
      labels={labels}
      formatters={formatters}
      companionMetrics={companionMetrics}
      companionFormatters={companionFormatters}
      colors={colors}
      ViewAll={ViewAll}
      timeConfig={timeConfig}
      testId={testId}
      renderHistoricDataIndicator
      getList={getList}
      Renderer={TopListCardPresenter}
      Label={Label}
      Metric={Metric}
      urlMatrixParamConfig={urlMatrixParamConfig}
    />
  );
}

type GetList = {
  testId: string;
  timeConfig: TimeConfig;
  selectedMetric: string;
};

function getList({ testId, timeConfig, selectedMetric }: GetList) {
  let baseTagFilters: TagFilter[] = [
    {
      stringValue: testId,
      name: 'testId',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  let statusTagFilters: TagFilter[] = [
    {
      stringValue: testId,
      name: 'testId',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    },
    {
      stringValue: '0',
      name: 'status',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  let tagFilters = new Map<string, TagFilter[]>([
    ['response_time', baseTagFilters],
    ['finish_time', baseTagFilters],
    ['status', statusTagFilters]
  ]);

  const metrics = [metricInPayload.get(selectedMetric)];

  return getTestResultList({
    pagination: {
      page: 1,
      pageSize: 5
    },
    // @ts-ignore
    order: orders.get(selectedMetric),
    // @ts-ignore
    syntheticMetrics: metrics,
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    // @ts-ignore
    tagFilters: tagFilters.get(selectedMetric)
  });
}

function ViewAll() {
  return (
    <Link href={''} onClick={() => trackTopListNavigation()}>
      {t('in-synthetics:dashboard.summary.widgets.linkViewAllTestResults')}
    </Link>
  );
}

type Lab = {
  item: any;
};

function Label({ item }: Lab) {
  return item.testResultCommonProperties.locationId.split('_', 1);
}

type Met = {
  formattedMetricValue: any;
};

function Metric({ formattedMetricValue }: Met) {
  return formattedMetricValue;
}
