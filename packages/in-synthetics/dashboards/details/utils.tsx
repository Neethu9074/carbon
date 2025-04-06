/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { Link } from '@instana/components';
import { t } from '@instana/i18n-react';

import BrowserTestMainSection from 'in-synthetics/dashboards/details/components/browser/BrowserTestMainSection';
import { ResultDetailsResponse, syntheticCustomMetricPrefix } from 'in-synthetics/utils/constants';
import { syntheticDetailsPath, syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { ContextConfiguration } from 'in-components/DashboardHeader/DashboardHeader';
import Timeline from 'in-synthetics/dashboards/details/components/Timeline';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { Location } from 'in-stores/navigation/types';
import KpiCard from 'in-components/KpiCard/KpiCard';

import locals from 'in-synthetics/dashboards/details/AnalyzeView.mless';

export const getStatusKPICard = (status: number) => {
  if (status === 1) {
    return (
      <KpiCard
        title={t('in-synthetics:dashboard.detailsPage.statusKpiCard')}
        value={t('in-synthetics:dashboard.detailsPage.successResult')}
        color={themes.default.ids.color.option.green['500']}
      />
    );
  } else {
    return (
      <KpiCard
        title={t('in-synthetics:dashboard.detailsPage.statusKpiCard')}
        value={t('in-synthetics:dashboard.detailsPage.failedResult')}
        color={themes.default.ids.color.option.red['500']}
      />
    );
  }
};

export const getTestTypeRequestsCount = (isBrowserTest: boolean, timelineDetails: ResultDetailsResponse) => {
  if (isBrowserTest) {
    return timelineDetails.data?.har?.log.entries.length;
  }
  return timelineDetails.data?.subtransactions?.length;
};

export const getResponseSize = (
  responseSize: string | null | undefined,
  location: Location,
  item: TestResultListItem | undefined
) => {
  if (responseSize) {
    return +(getMatrixParameter(location, syntheticDetailsPath, 'responseSize') ?? 0);
  }
  return get(item, ['metrics', 'response_size', 0, 1], 0);
};

export const getTestTypeTimeline = (
  isBrowserTest: boolean,
  timelineDetails: ResultDetailsResponse,
  startTime: number,
  finishTime: number
) => {
  if (isBrowserTest) {
    return (
      <BrowserTestMainSection
        details={timelineDetails}
        startTime={startTime}
        finishTime={finishTime}
        isBrowserType={isBrowserTest}
      />
    );
  }
  return <Timeline details={timelineDetails} startTime={startTime} finishTime={finishTime} />;
};

export const useSyntheticContextConfiguration = () => {
  const { location, createHref } = useNavigation();
  const contextConfigurations: ContextConfiguration[] = [];

  const testId: string = getMatrixParameter(location, syntheticDetailsPath, 'testId') ?? '';
  const testType: string = getMatrixParameter(location, syntheticDetailsPath, 'type') ?? '';
  const testLabel: string = getMatrixParameter(location, syntheticDetailsPath, 'testLabel') ?? '';
  const locationDisplayLabels: string =
    getMatrixParameter(location, syntheticDetailsPath, 'locationDisplayLabels') ?? '';
  const locationIds: string = getMatrixParameter(location, syntheticDetailsPath, 'locationIds') ?? '';

  location.pathname = syntheticsDashboard;

  setOrDeleteMatrixKey(location, syntheticsDashboard, 'testId', testId);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'testLabel', testLabel);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'type', testType);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'locationDisplayLabels', locationDisplayLabels);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'locationIds', locationIds);

  contextConfigurations.push({
    renderContext: () => {
      return (
        <Link href={createHref(location)} className={locals.contextLink}>
          {testLabel}
        </Link>
      );
    },
    contextIcon: 'lib_synthetic'
  });
  return contextConfigurations;
};

export const getSyntheticCustomMetricLabels = (
  resultList: Result<PaginatedResult<TestResultListItem>>,
  testType: string
) => {
  if (!['DNS', 'SSLCertificate'].includes(testType) && resultList?.data?.items?.[0]?.metrics) {
    return Object.keys(resultList.data.items[0].metrics).filter(metric =>
      metric.startsWith(syntheticCustomMetricPrefix)
    );
  }
  return [];
};

export function getSyntheticTagLabels(resultList: Result<PaginatedResult<TestResultListItem>>) {
  if (resultList.data?.items[0]?.testResultCommonProperties.customTags)
    return Object.keys(resultList.data?.items[0]?.testResultCommonProperties.customTags);
  return [];
}

export const getResultErrorMessage = (error: string) => {
  if (error) {
    let start: number = error.search('errorMessage=');
    let len: number = error?.length;
    return error.slice(start + 'errorMessage='.length, len - 1);
  }
  return '';
};

export function formatErrorMessage(error: string) {
  const errorMessage = getResultErrorMessage(error);
  return errorMessage.length > 40 ? errorMessage.slice(0, 40) + '...' : errorMessage;
}
