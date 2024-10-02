/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';
import moment from 'moment';

import { formatDateTime, fromNow } from '@instana/format-date';
import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import { syntheticResultsListPath, syntheticsDashboard, syntheticDetailsPath } from 'in-synthetics/navigation/paths';
import { clickSyntheticMonitoringResultsWidgetDetailTracker } from 'in-synthetics/tracking/tracker';
import { massageLocationDisplayLabel } from 'in-synthetics/utils/massageLocationDisplayLabel';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { TagFilter, TestResultListItem, TimeConfig } from 'in-types';
import { statusTagName, testIdTagName } from 'in-synthetics/tags';
import { latency } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
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

interface ResultsTopListProps {
  testId: string;
}

export default function ResultsTopList({ testId }: ResultsTopListProps) {
  const timeConfig = useTimeConfig();
  const colors = [null, null, themes.default.ids.color.option.red['500']];
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
  const baseTagFilters: TagFilter[] = [
    {
      stringValue: testId,
      name: testIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  const statusTagFilters: TagFilter[] = [
    {
      stringValue: testId,
      name: testIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    },
    {
      numberValue: 0,
      name: statusTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  const tagFilters = [baseTagFilters, baseTagFilters, statusTagFilters];

  return getTestResultList({
    pagination: {
      page: 1,
      pageSize: 5
    },
    // @ts-expect-error The expected type comes from property 'order' which is declared here on type 'GetTestResultListQuery'
    order: orders[metrics.indexOf(selectedMetric)],
    syntheticMetrics: metrics,
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    tagFilters: tagFilters[metrics.indexOf(selectedMetric)]
  });
}

interface ViewAllProps {
  testId: string;
  selectedMetric: string;
}

function ViewAll({ testId, selectedMetric }: ViewAllProps) {
  const { location, createHref } = useNavigation();
  location.pathname = syntheticResultsListPath;
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'testId', testId);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'selectedMetric', selectedMetric);

  return <Link href={createHref(location)}>{t('in-synthetics:dashboard.summary.widgets.linkViewAllTestResults')}</Link>;
}

type LabelProps = {
  item: TestResultListItem;
  selectedMetric: string;
};

function Label({ item, selectedMetric }: LabelProps) {
  const { trackCta } = useSegmentTracking();
  const { location, createHref } = useNavigation();
  const testId = item.testResultCommonProperties.testId;
  const testLabel: string = getMatrixParameter(location, syntheticsDashboard, 'testLabel') ?? '';
  const locationIds: string = getMatrixParameter(location, syntheticsDashboard, 'locationIds') ?? '';
  const locationDisplayLabels: string =
    getMatrixParameter(location, syntheticsDashboard, 'locationDisplayLabels') ?? '';
  const resultId = item.testResultCommonProperties.id;
  //If a location is deleted, then the default value of its display label is locationId + '-deleted'
  const testLocation = massageLocationDisplayLabel(
    item.testResultCommonProperties?.locationDisplayLabel ?? '',
    item.testResultCommonProperties?.locationId ?? ''
  );
  const resultsLabel = testLocation + AdditionalLabel({ item, selectedMetric });
  location.pathname = syntheticDetailsPath;
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'testId', testId);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'id', resultId);
  setOrDeleteMatrixKey(
    location,
    syntheticDetailsPath,
    'type',
    getMatrixParameter(location, syntheticsDashboard, 'type')
  );
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'startTime', get(item, ['metrics', 'start_time', 0, 1]));
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'finishTime', get(item, ['metrics', 'start_time', 0, 0]));
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'status', get(item, ['metrics', 'status', 0, 1], 0));
  setOrDeleteMatrixKey(
    location,
    syntheticDetailsPath,
    'responseTime',
    get(item, ['metrics', 'response_time', 0, 1], 0)
  );
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'testLabel', testLabel);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'locationDisplayLabels', locationDisplayLabels);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'locationIds', locationIds);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'resultsLabel', resultsLabel);
  return (
    <Link href={createHref(location)} onClick={() => clickSyntheticMonitoringResultsWidgetDetailTracker(trackCta)}>
      {resultsLabel}
    </Link>
  );
}

interface AdditionalLabelProps {
  item: TestResultListItem;
  selectedMetric: string;
}

function AdditionalLabel({ item, selectedMetric }: AdditionalLabelProps) {
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

type MetricProps = {
  formattedMetricValue: any;
  item: TestResultListItem;
  selectedMetric: string;
};

function Metric({ formattedMetricValue, item, selectedMetric }: MetricProps) {
  const status = get(item, ['metrics', 'status', 0, 1], 0);
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
