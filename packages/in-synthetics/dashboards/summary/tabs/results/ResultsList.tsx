/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { OrderDirection, TagFilter, TagFilterExpression, TestResultListItem, TimeConfig } from '@instana/types';
import { formatDateTime, fromNow } from '@instana/format-date';
import { t } from '@instana/i18n-react';

import {
  DataScopeType,
  ResultsCurrentState,
  ResultsFilterState,
  resultsFilterUrlStateDefinition,
  runTypeCICD,
  runTypeScheduled,
  TestResponse
} from 'in-synthetics/utils/constants';
// @ts-expect-error Could not find declaration type
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Could not find declaration type
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error Could not find declaration type
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { locationLabelTagName, runTypeTagName, statusTagName, testIdTagName } from 'in-synthetics/tags';
import { bytesTwoDecimalPlaces, timeByMillisZeroDecimalPlaces } from 'in-services/formatters/number';
import { clickSyntheticMonitoringResultsListDetailTracker } from 'in-synthetics/tracking/tracker';
import FailureTypePopover from 'in-synthetics/dashboards/summary/tabs/results/FailureTypePopover';
import { massageLocationDisplayLabel } from 'in-synthetics/utils/massageLocationDisplayLabel';
import { CONTAINS, EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticsDashboard, syntheticDetailsPath } from 'in-synthetics/navigation/paths';
import ResultFilters from 'in-synthetics/dashboards/summary/tabs/results/ResultFilters';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { syntheticDnsEnabled, syntheticRunNowEnabled } from 'in-services/featureFlags';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer/Footer';
import useUrlState from 'in-hooks/useUrlState';

import locals from 'in-synthetics/dashboards/summary/tabs/results/ResultsList.mless';

const pathSegment = '/results';
const matrixPrefix = 'result.';

// Initialize metrics array based on test type
const getMetricsForTestType = (testType: string) => {
  const baseMetrics = ['start_time', 'location_id', 'response_time', 'status', 'retries'];

  if (testType === 'SSLCertificate') {
    return [...baseMetrics, 'custom_metrics'];
  } else if (testType === 'DNS') {
    return [...baseMetrics, 'errors'];
  } else {
    return [...baseMetrics, 'response_size'];
  }
};
let testId = '';
let testType: string;

function StartTimeColumn({ item }: { item: TestResultListItem }) {
  const { trackCta } = useSegmentTracking();
  const { location, createHref } = useNavigation();
  location.pathname = syntheticDetailsPath;

  testId = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';

  const resultId = item.testResultCommonProperties.id ?? '';
  const testLabel: string = getMatrixParameter(location, syntheticsDashboard, 'testLabel') ?? '';
  const locationIds: string = getMatrixParameter(location, syntheticsDashboard, 'locationIds') ?? '';
  const locationDisplayLabels: string =
    getMatrixParameter(location, syntheticsDashboard, 'locationDisplayLabels') ?? '';
  const executionType = item?.testResultCommonProperties?.runType ?? '';

  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'testId', item.testResultCommonProperties.testId);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'id', resultId);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'startTime', get(item, ['metrics', 'start_time', 0, 1]));
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'finishTime', get(item, ['metrics', 'start_time', 0, 0]));
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'status', get(item, ['metrics', 'status', 0, 1], 0));
  setOrDeleteMatrixKey(
    location,
    syntheticDetailsPath,
    'responseTime',
    get(item, ['metrics', 'response_time', 0, 1], 0)
  );
  setOrDeleteMatrixKey(
    location,
    syntheticDetailsPath,
    'responseSize',
    get(item, ['metrics', 'response_size', 0, 1], 0)
  );
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'type', testType);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'testLabel', testLabel);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'locationDisplayLabels', locationDisplayLabels);
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'locationIds', locationIds);
  setOrDeleteMatrixKey(
    location,
    syntheticDetailsPath,
    'resultsLabel',
    item.testResultCommonProperties.locationDisplayLabel + ', ' + getRelativeTime(item)
  );
  setOrDeleteMatrixKey(location, syntheticDetailsPath, 'runType', executionType);

  return (
    <div onClick={() => clickSyntheticMonitoringResultsListDetailTracker(trackCta)}>
      <SeverityAwareEntityLink severity={getSeverity(item)} label={getRelativeTime(item)} href={createHref(location)} />
    </div>
  );
}

const runTypeColumnContent = (item: TestResultListItem) => {
  return <span className={locals.metricLabel}>{item.testResultCommonProperties?.runType ?? ''}</span>;
};

const daysRemainingColumnContent = (item: TestResultListItem) => {
  const daysRemaining = get(item, ['metrics', 'synthetic.customMetrics.daysRemaining', 0, 1]);
  return <span className={locals.metricLabel}>{daysRemaining}</span>;
};

function renderFailurePopover(item: TestResultListItem) {
  return <FailureTypePopover resultItem={item} />;
}
interface ResultListProps {
  test: TestResponse;
  dataScope?: DataScopeType;
}

const startTimeColumnContent = (item: TestResultListItem) => {
  return <StartTimeColumn item={item} />;
};

export const locationLabelColumnContent = (item: TestResultListItem) => {
  const displayLabel = massageLocationDisplayLabel(
    item?.testResultCommonProperties?.locationDisplayLabel ?? '',
    item?.testResultCommonProperties?.locationId ?? ''
  );
  return <span className={locals.metricLabel}>{displayLabel}</span>;
};

export const responseTimeColumnContent = (item: TestResultListItem) => {
  const count = get(item, ['metrics', 'response_time', 0, 1], 0);
  return <span className={locals.metricLabel}>{timeByMillisZeroDecimalPlaces(count)}</span>;
};

export const responseSizeColumnContent = (item: TestResultListItem) => {
  const count = get(item, ['metrics', 'response_size', 0, 1], 0);
  return <span className={locals.metricLabel}>{bytesTwoDecimalPlaces(count)}</span>;
};

export const retriesColumnContent = (item: TestResultListItem) => {
  const count = get(item, ['metrics', 'retries', 0, 1], 0);
  return <span className={locals.metricLabel}>{count}</span>;
};

export default function ResultsList({ test, dataScope }: ResultListProps) {
  const timeConfig = useTimeConfig();
  const location = useLocation();
  testId = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  testType = test.data?.configuration?.syntheticType || '';
  const isSSLCertificate = testType === 'SSLCertificate';
  const isDNS = testType === 'DNS';
  const locationDisplayLabels: string[] =
    getMatrixParameter(location, syntheticsDashboard, 'locationDisplayLabels')?.split(',') ?? [];
  const selectedMetric = getMatrixParameter(location, syntheticsDashboard, 'selectedMetric');
  const defaultOrderBy: string = !selectedMetric || selectedMetric !== 'response_time' ? 'start_time' : 'response_time';
  const defaultOrderDirection: string = 'DESC';

  const urlStateDefinition = {
    bind: resultsFilterUrlStateDefinition(selectedMetric!).bind,
    reducer: (prevState: ResultsFilterState, { status, locationLabels }: ResultsCurrentState) => ({
      status: status || prevState.status,
      locationLabels: locationLabels || prevState.locationLabels
    })
  };

  const [{ status, locationLabels }, setFilter] = useUrlState(urlStateDefinition);

  const rightHeader = (
    <ResultFilters
      setFilter={setFilter}
      status={status}
      locationLabels={locationLabels}
      locationsDisplayLabels={locationDisplayLabels}
    />
  );

  // Define all column definitions upfront using React.useMemo to prevent re-renders
  const columnDefinitions = React.useMemo(() => {
    // Base columns that are always included
    const baseColumns: ColumnDefinition<TestResultListItem>[] = [
      {
        id: 'start_time',
        label: t('in-synthetics:dashboard.resultsListPage.startedColumn'),
        defaultOrderDirection: 'DESC',
        getContent: startTimeColumnContent
      },
      {
        //location_label => location display name
        id: 'location_label',
        label: t('in-synthetics:dashboard.resultsListPage.locationColumn'),
        getContent: locationLabelColumnContent
      },
      {
        id: 'response_time',
        defaultOrderDirection: 'DESC',
        label: t('in-synthetics:dashboard.resultsListPage.responseTimeColumn'),
        getContent: responseTimeColumnContent
      }
    ];

    // Conditionally add response_size column
    if (!isSSLCertificate && !isDNS) {
      baseColumns.push({
        id: 'response_size',
        defaultOrderDirection: 'DESC' as OrderDirection,
        label: t('in-synthetics:dashboard.resultsListPage.responseSizeColumn'),
        getContent: responseSizeColumnContent
      });
    }

    // Add retries and runType columns
    baseColumns.push(
      {
        id: 'retries',
        defaultOrderDirection: 'DESC',
        label: t('in-synthetics:dashboard.resultsListPage.retriesColumn'),
        getContent: retriesColumnContent
      },
      {
        id: 'synthetic.runType',
        defaultOrderDirection: 'DESC',
        label: t('in-synthetics:dashboard.resultsListPage.cicd.executionType'),
        getContent: runTypeColumnContent
      }
    );

    // Conditionally add SSL certificate specific column
    if (isSSLCertificate) {
      baseColumns.push({
        id: 'days_remaining',
        sortable: false,
        label: t('in-synthetics:dashboard.resultsListPage.daysRemaining'),
        getContent: daysRemainingColumnContent
      });
    }

    // Conditionally add DNS specific column
    if (syntheticDnsEnabled && isDNS) {
      baseColumns.push({
        id: 'failure_type',
        sortable: false,
        width: 25,
        label: t('in-synthetics:dashboard.resultsListPage.dns.failureType'),
        getContent: renderFailurePopover
      });
    }

    return baseColumns;
  }, [isSSLCertificate, isDNS]); // Dependencies that affect column definitions

  const ServerTableWithUrlState = createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions,
      title: t('in-synthetics:dashboard.noDataAvailable.resultsTitle'),
      description: t('in-synthetics:dashboard.noDataAvailable.resultsDescription')
    }),
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      resultsFilterUrlStateDefinition(selectedMetric!).bind
    ],
    columnDefinitions,
    defaultOrderBy,
    defaultOrderDirection,
    pathSegment,
    matrixPrefix
  });

  return (
    <>
      <ServerTableWithUrlState
        get={getSynthTableData}
        timeConfig={timeConfig}
        cardTitle={t('in-synthetics:dashboard.resultsListPage.title')}
        rightHeader={rightHeader}
        status={status}
        locationLabels={locationLabels}
        runType={dataScope?.value}
      />
      <Footer />
    </>
  );
}

type GetList = {
  timeConfig: TimeConfig;
  orderBy: string;
  orderDirection: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
  status?: string[];
  locationLabels?: string[];
  runType?: string;
};

function getSynthTableData({
  timeConfig,
  orderBy = 'start_time',
  orderDirection = 'DESC',
  page = 1,
  pageSize = 20,
  query = '',
  status = [],
  locationLabels = [],
  runType = ''
}: GetList) {
  // Use the metrics array specific to this test type
  const metrics = getMetricsForTestType(testType);
  let baseTagFilters: TagFilter[] = [
    {
      stringValue: testId,
      name: testIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  let statusTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };

  let locationTagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'OR',
    type: 'EXPRESSION'
  };

  let tagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };

  //location_label => location display name
  if (query && query.length > 0) {
    baseTagFilters = [
      {
        stringValue: testId,
        name: testIdTagName,
        operator: EQUALS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      },
      {
        stringValue: query,
        name: locationLabelTagName,
        operator: CONTAINS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      }
    ];
  }

  if (status.length !== 0 && Array.isArray(status)) {
    status.forEach(stat => {
      statusTagFilterExpression.elements.push({
        value: parseInt(stat),
        name: statusTagName,
        operator: EQUALS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      });
    });
  }

  if (locationLabels.length !== 0 && Array.isArray(locationLabels)) {
    locationLabels.forEach(locationLabel => {
      locationTagFilterExpression.elements.push({
        stringValue: locationLabel,
        name: locationLabelTagName,
        operator: EQUALS,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      });
    });
  }

  tagFilterExpression = {
    elements: [statusTagFilterExpression, locationTagFilterExpression],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
  if (syntheticRunNowEnabled) {
    const runTypeTagFilterExpression: TagFilterExpression = {
      elements: [],
      logicalOperator: 'OR',
      type: 'EXPRESSION'
    };
    runTypeTagFilterExpression.elements.push({
      value: runType === runTypeCICD ? runTypeScheduled : runType,
      name: runTypeTagName,
      operator: runType === runTypeCICD ? NOT_EQUAL : EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
    tagFilterExpression.elements.push(runTypeTagFilterExpression);
  }
  return getTestResultList({
    pagination: {
      page,
      pageSize
    },
    order: { by: orderBy, direction: orderDirection },
    syntheticMetrics: metrics,
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    tagFilters: baseTagFilters,
    tagFilterExpression
  });
}

function getSeverity(item: TestResultListItem) {
  return getStatus(item) === 1 ? 0 : 10;
}

export function getRelativeTime(item: TestResultListItem) {
  let status = getStatus(item);
  let date = get(item, ['metrics', 'start_time', 0, 1]);
  return status === 1 ? fromNow(date) : formatDateTime(date);
}

function getStatus(item: TestResultListItem) {
  return get(item, ['metrics', 'status', 0, 1], 0);
}
