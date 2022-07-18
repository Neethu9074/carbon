/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';
import moment from 'moment';

import { formatDateTime, fromNow } from '@instana/format-date';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { syntheticResultsListPath, syntheticsDashboard, syntheticDetailsPath } from 'in-synthetics/navigation/paths';
//import { TestResponse } from 'in-synthetics/utils/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
// @ts-ignore
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-ignore
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { latency } from 'in-services/formatters/number';
import { TagFilter, TimeConfig } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './ResultsTopList.mless';

const metrics = ['response_time', 'start_time', 'status'];

const orders = [
  { by: 'response_time', direction: 'DESC' },
  { by: 'start_time', direction: 'DESC' },
  { by: 'start_time', direction: 'DESC' }
];

const labels = [
  t('in-synthetics:dashboard.summary.widgets.slowest'),
  t('in-synthetics:dashboard.summary.widgets.latest'),
  t('in-synthetics:dashboard.summary.widgets.failed')
];
const formatters = [latency.compact, fromNow, fromNow];
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
      numberValue: 0,
      name: 'status',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  let tagFilters = [baseTagFilters, baseTagFilters, statusTagFilters];

  return getTestResultList({
    pagination: {
      page: 1,
      pageSize: 5
    },
    // @ts-ignore
    order: orders[metrics.indexOf(selectedMetric)],
    // @ts-ignore
    syntheticMetrics: metrics,
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    // @ts-ignore
    tagFilters: tagFilters[metrics.indexOf(selectedMetric)]
  });
}

function ViewAll({ testId }: Props) {
  return (
    <Link
      href$={getModifiedUrlStream(resultListUrl => {
        resultListUrl.pathname = syntheticResultsListPath;
        setOrDeleteMatrixKey(resultListUrl, syntheticsDashboard, 'testId', testId);
        return resultListUrl;
      })}
    >
      {t('in-synthetics:dashboard.summary.widgets.linkViewAllTestResults')}
    </Link>
  );
}

type Lab = {
  item: any;
  selectedMetric: string;
};

function Label({ item, selectedMetric }: Lab) {
  let testId = item.testResultCommonProperties.testId;
  let resultId = item.testResultCommonProperties.id;
  return (
    <Link
      href$={getModifiedUrlStream(resultDetailUrl => {
        resultDetailUrl.pathname = syntheticDetailsPath;
        setOrDeleteMatrixKey(resultDetailUrl, syntheticDetailsPath, 'testId', testId);
        setOrDeleteMatrixKey(resultDetailUrl, syntheticDetailsPath, 'id', resultId);
        return resultDetailUrl;
      })}
    >
      {item.testResultCommonProperties.locationLabel + AdditionalLabel({ item, selectedMetric })}
    </Link>
  );
}

function AdditionalLabel({ item, selectedMetric }: Lab) {
  let additionalLabel = '';
  let formattedTime = '';
  if (selectedMetric === 'response_time') {
    let startTime = moment.unix(get(item, ['metrics', 'start_time', 0, 1], moment.now()) / 1000);
    let date = get(item, ['metrics', 'start_time', 0, 1]);
    if (startTime.diff(moment.now(), 'days') < -1) {
      // start time is greater than 24 hours, show date time
      formattedTime = formatDateTime(date) as string;
    } else {
      formattedTime = fromNow(date) as string;
    }
    additionalLabel = ', ' + formattedTime;
  }
  return additionalLabel;
}

type Met = {
  formattedMetricValue: any;
  item: any;
  selectedMetric: string;
};

function Metric({ formattedMetricValue, item, selectedMetric }: Met) {
  let status = get(item, ['metrics', 'status', 0, 1], 0);
  if (selectedMetric !== 'status') {
    if (status === 1) {
      return formattedMetricValue;
    } else {
      return (
        <Fragment>
          <SvgIcon className={locals.alertIcon} size="xs" type="lib_help_error_warning" />
          {formattedMetricValue}
        </Fragment>
      );
    }
  } else {
    return fromNow(get(item, ['metrics', 'start_time', 0, 1]));
  }
}
