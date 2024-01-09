/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';
import { get, head } from 'lodash';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { formatDateTime } from '@instana/format-date';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { Link } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  dummyResultDetails,
  dummyResultMetadata,
  dummyTestResultList,
  ResultDetailsResponse,
  ResultMetadataResponse
} from 'in-synthetics/utils/constants';
import BrowserTestMainSection from 'in-synthetics/dashboards/details/components/browser/BrowserTestMainSection';
import DashboardHeader, { ContextConfiguration } from 'in-components/DashboardHeader/DashboardHeader';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { syntheticDetailsPath, syntheticsDashboard } from 'in-synthetics/navigation/paths';
import getTestResultDetailData from 'in-synthetics/subscriptions/getTestResultDetailData';
import getTestResultListStatus from 'in-synthetics/subscriptions/getTestResultListStatus';
import { startTimeTagName, testIdTagName, testResultIdTagName } from 'in-synthetics/tags';
import DownloadButton from 'in-synthetics/dashboards/details/components/DownloadButton';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import FailedRun from 'in-synthetics/dashboards/details/components/FailedRun';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import Timeline from 'in-synthetics/dashboards/details/components/Timeline';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { syntheticBrowserScriptEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import isBrowserTestType from 'in-synthetics/utils/isBrowserTestType';
import Logs from 'in-synthetics/dashboards/details/components/Logs';
import { getValidFormat } from 'in-synthetics/utils/getValidFormat';
import { bytes, meanLatency } from 'in-services/formatters/number';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { getTestResultMetadata } from 'in-synthetics/api';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Sticky from 'in-components/Sticky';

import locals from 'in-bizops/dashboards/activity/BusinessActivitySummary.mless';

export default function SyntheticAnalyzeView() {
  const location = useLocation();
  const timeConfig = useTimeConfig();
  const page = 1;
  const pageSize = 1;
  const testId: string = getMatrixParameter(location, syntheticDetailsPath, 'testId') ?? '';
  const resultId: string = getMatrixParameter(location, syntheticDetailsPath, 'id') ?? '';
  const startTime: number = +(getMatrixParameter(location, syntheticDetailsPath, 'startTime') ?? 0);
  const status: number = +(getMatrixParameter(location, syntheticDetailsPath, 'status') ?? 0);
  const responseTime: number = +(getMatrixParameter(location, syntheticDetailsPath, 'responseTime') ?? 0);
  const finishTime: number = startTime + responseTime;
  const testType: string = getMatrixParameter(location, syntheticDetailsPath, 'type') ?? '';
  const isHTTPActionType: boolean = testType === 'HTTPAction';
  const isBrowserTest: boolean = isBrowserTestType(testType) && syntheticBrowserScriptEnabled;
  const responseSize = getMatrixParameter(location, syntheticDetailsPath, 'responseSize');
  const resultsLabel: string = getMatrixParameter(location, syntheticDetailsPath, 'resultsLabel') ?? '';

  const testResultMetadata: ResultMetadataResponse =
    useObservable<any, [number]>(() => getTestResultMetadata(testId, resultId, startTime), [0]) || dummyResultMetadata;
  const formatType = testResultMetadata.progress.loading ? '' : getValidFormat(testResultMetadata);
  const metadata = testResultMetadata.progress.loading
    ? ''
    : Object.keys(testResultMetadata.data?.metadata || {}).toString();

  const timelineDetails: ResultDetailsResponse =
    useObservable<any, [any]>(
      formatType => {
        if (formatType[0] != undefined && formatType[0] != '') {
          return getTestResultDetailData({
            testId: testId,
            testResultId: resultId,
            type: formatType[0],
            startTime: startTime
          });
        } else {
          return just({ ...dummyResultDetails, progress: { loading: false } });
        }
      },
      [formatType]
    ) || dummyResultDetails;

  const tagFilters = [
    {
      stringValue: testId,
      name: testIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    },
    {
      stringValue: resultId,
      name: testResultIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    },
    {
      //Add startTime in tagFilter to improve synthetics-reader side CH query performance
      numberValue: startTime,
      name: startTimeTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  const resultList: Result<PaginatedResult<TestResultListItem>> =
    useObservable<any, [number]>(
      () =>
        getTestResultList({
          pagination: {
            page,
            pageSize
          },
          order: { by: 'errors', direction: 'DESC' },
          syntheticMetrics: ['errors', 'status', 'start_time', 'response_size'],
          filter: {
            //timeConfig is ignored in synthetics-reader CH query
            //since given a testId and testResultId, the entry should be unique
            //and should not be changed as time window changes.
            timeConfig,
            includeInternalCalls: false,
            includeSyntheticCalls: false,
            useLongTermDataOnly: false
          },
          // @ts-expect-error tagFilters do not fully match the TagFilter type
          tagFilters: tagFilters
        }),
      [0]
    ) || dummyTestResultList;

  const renderMetaInformation = () => {
    return isBrowserTest ? <BetaBadge /> : null;
  };

  const contextConfigurations: ContextConfiguration[] = [];
  contextConfigurations.push({
    renderContext: RenderTestSummaryContext,
    contextIcon: 'lib_synthetic'
  });

  return (
    <>
      <Sticky
        header={
          <>
            <DashboardHeader
              title={t('in-synthetics:dashboard.testList.mainLabel')}
              label={resultsLabel}
              withBorderBottom
              renderMetaInformation={renderMetaInformation}
              contextConfigurations={contextConfigurations}
              liveModeDisabled
              liveModeDisabledTooltip={t('in-synthetics:dashboard.detailsPage.detailLiveModeDisabled')}
            />
            <DashboardHeaderShadowModule />
          </>
        }
      >
        {timelineDetails.progress.loading || resultList.progress.loading || testResultMetadata.progress.loading ? (
          <LoadingIndicator text={t('in-components:topListCard.loadingData')} height={160} size="xxxl" />
        ) : (
          <LeftRightPadding>
            <ViewTrackingMeta
              data={{
                productArea: productAreas.synthetic_monitoring,
                pageRootName: pageNames.synthetic_test_result,
                pagePath: location?.pathname
              }}
            />
            <Fragment>
              {isBrowserTest && (
                <Row>
                  <DownloadButton testId={testId} resultId={resultId} metadata={metadata} startTime={startTime} />
                </Row>
              )}
              <Row>
                <Col xs>
                  <KpiCard
                    title={t('in-synthetics:dashboard.summary.startTime')}
                    value={startTime}
                    renderValue={formatDateTime}
                  />
                </Col>
                <Col xs>
                  {status === 1 ? (
                    <KpiCard
                      title={t('in-synthetics:dashboard.detailsPage.statusKpiCard')}
                      value={t('in-synthetics:dashboard.detailsPage.successResult')}
                      color={themes.default.ids.color.option.green['500']}
                    />
                  ) : (
                    <KpiCard
                      title={t('in-synthetics:dashboard.detailsPage.statusKpiCard')}
                      value={t('in-synthetics:dashboard.detailsPage.failedResult')}
                      color={themes.default.ids.color.option.red['500']}
                    />
                  )}
                </Col>
                <Col xs>
                  <KpiCard
                    title={t('in-synthetics:dashboard.summary.responseTime')}
                    value={responseTime}
                    renderValue={meanLatency.detailed}
                  />
                </Col>
                <Col
                  xs
                  style={{
                    display: get(timelineDetails, ['errors', 0, 'code'], '') === 'NOT_FOUND' ? 'none' : 'block'
                  }}
                >
                  <KpiCard
                    title={t('in-synthetics:dashboard.summary.requests')}
                    value={
                      isBrowserTest
                        ? timelineDetails.data?.har?.log.entries.length
                        : timelineDetails.data?.subtransactions?.length
                    }
                  />
                </Col>

                <Col xs>
                  <KpiCard
                    title={t('in-synthetics:dashboard.summary.responseSize')}
                    value={
                      responseSize
                        ? +(getMatrixParameter(location, syntheticDetailsPath, 'responseSize') ?? 0)
                        : get(resultList.data?.items[0], ['metrics', 'response_size', 0, 1], 0)
                    }
                    renderValue={bytes.detailed}
                  />
                </Col>
              </Row>
              {getTestResultListStatus(resultList) !== 1 && (
                <Row>
                  <Col xs>
                    <FailedRun resultList={resultList} />
                  </Col>
                </Row>
              )}
              <Row>
                <Col lg={12}>
                  {isBrowserTest ? (
                    <BrowserTestMainSection
                      details={timelineDetails}
                      startTime={startTime}
                      finishTime={finishTime}
                      isBrowserType={isBrowserTest}
                    />
                  ) : (
                    <Timeline details={timelineDetails} startTime={startTime} finishTime={finishTime} />
                  )}
                </Col>
              </Row>
              {!isHTTPActionType && (
                <Row>
                  <Col lg={12}>
                    <Logs
                      testId={testId}
                      resultId={resultId}
                      timestamp={get(head(get(timelineDetails, ['data', 'subtransactions'])), 'properties.startTime')}
                      isBrowserTestType={isBrowserTest}
                      metadata={metadata}
                    />
                  </Col>
                </Row>
              )}
            </Fragment>
          </LeftRightPadding>
        )}
      </Sticky>
    </>
  );
}

function RenderTestSummaryContext() {
  const { location, createHref } = useNavigation();
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
  return (
    <Link href={createHref(location)} className={locals.contextLink}>
      {testLabel}
    </Link>
  );
}
