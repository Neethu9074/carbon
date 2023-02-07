/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useLocation } from 'react-router';
import React, { Fragment } from 'react';
import { get, head } from 'lodash';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { formatDateTime } from '@instana/format-date';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import {
  dummyResultDetails,
  dummyResultMetadata,
  dummyTest,
  dummyTestResultList,
  ResultDetailsResponse,
  ResultMetadataResponse,
  TestResponse
} from 'in-synthetics/utils/constants';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import BrowserTestTimeline from 'in-synthetics/dashboards/details/components/BrowserTestTimeline';
import getTestResultDetailData from 'in-synthetics/subscriptions/getTestResultDetailData';
import DownloadButton from 'in-synthetics/dashboards/details/components/DownloadButton';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import getTestResultListStatus from 'in-synthetics/utils/getTestResultListStatus';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import FailedRun from 'in-synthetics/dashboards/details/components/FailedRun';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import Timeline from 'in-synthetics/dashboards/details/components/Timeline';
import { syntheticBrowserScriptEnabled } from 'in-services/featureFlags';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticDetailsPath } from 'in-synthetics/navigation/paths';
import Logs from 'in-synthetics/dashboards/details/components/Logs';
import { bytes, meanLatency } from 'in-services/formatters/number';
import { getTest, getTestResultMetadata } from 'in-synthetics/api';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import theme from 'in-themes';

export default function SyntheticAnalyzeView() {
  const location = useLocation();
  const timeConfig = useTimeConfig();
  const page = 1;
  const pageSize = 1;
  const testId: string = getMatrixParameter(location, syntheticDetailsPath, 'testId') ?? '';
  const resultId: string = getMatrixParameter(location, syntheticDetailsPath, 'id') ?? '';
  const startTime: number = +(getMatrixParameter(location, syntheticDetailsPath, 'startTime') ?? 0);
  const finishTime: number = +(getMatrixParameter(location, syntheticDetailsPath, 'finishTime') ?? 0);
  const status: number = +(getMatrixParameter(location, syntheticDetailsPath, 'status') ?? 0);
  const responseTime: number = +(getMatrixParameter(location, syntheticDetailsPath, 'responseTime') ?? 0);
  const responseSize: number = +(getMatrixParameter(location, syntheticDetailsPath, 'responseSize') ?? 0);
  const test: TestResponse = useObservable<any, [number]>(() => getTest(testId), [0]) || dummyTest;
  const testType: string = getMatrixParameter(location, syntheticDetailsPath, 'type') ?? '';
  const isHTTPActionType: boolean = testType === 'HTTPAction';
  const isBrowserScriptTest: boolean = testType === 'BrowserScript' && syntheticBrowserScriptEnabled;
  const formatType: string = isBrowserScriptTest ? 'HAR' : 'SUBTRANSACTIONS';
  const details: ResultDetailsResponse =
    useObservable<any, [number]>(
      () =>
        getTestResultDetailData({
          testId: testId,
          testResultId: resultId,
          type: formatType
        }),
      [0]
    ) || dummyResultDetails;

  const tagFilters = [
    {
      stringValue: testId,
      name: 'testId',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    },
    {
      stringValue: resultId,
      name: 'id',
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
          syntheticMetrics: ['errors', 'status', 'start_time'],
          filter: {
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

  const testResultMetadata: ResultMetadataResponse =
    useObservable<any, [number]>(() => getTestResultMetadata(testId, resultId), [0]) || dummyResultMetadata;

  const renderMetaInformation = () => {
    return <BetaBadge />;
  };
  return (
    <>
      <Sticky
        header={
          <>
            <DashboardHeader
              icon={'lib_synthetic'}
              title={t('in-synthetics:dashboard.testList.mainLabel')}
              label={get(test, ['data', 'label'])}
              withBorderBottom
              showHistoricDataWarning={false}
              renderMetaInformation={renderMetaInformation}
            />
            <DashboardHeaderShadowModule />
          </>
        }
      >
        {details.progress.loading || resultList.progress.loading || testResultMetadata.progress.loading ? (
          <LoadingIndicator text={t('in-components:topListCard.loadingData')} height={160} size="xxxl" />
        ) : (
          <LeftRightPadding>
            <ViewTrackingMeta
              data={{
                productArea: 'EUM: Synthetics',
                pageRootName: 'Synthetics Test'
              }}
            />
            <Fragment>
              {isBrowserScriptTest && (
                <Row>
                  <DownloadButton testId={testId} resultId={resultId} testResultMetadata={testResultMetadata} />
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
                      color={theme.lib.colors.success}
                    />
                  ) : (
                    <KpiCard
                      title={t('in-synthetics:dashboard.detailsPage.statusKpiCard')}
                      value={t('in-synthetics:dashboard.detailsPage.failedResult')}
                      color={theme.lib.colors.failure}
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
                    display: get(details, ['errors', 0, 'code'], '') === 'NOT_FOUND' ? 'none' : 'block'
                  }}
                >
                  <KpiCard
                    title={t('in-synthetics:dashboard.summary.requests')}
                    value={
                      isBrowserScriptTest
                        ? details.data?.har?.log.entries.length
                        : details.data?.subtransactions?.length
                    }
                  />
                </Col>

                <Col xs>
                  <KpiCard
                    title={t('in-synthetics:dashboard.summary.responseSize')}
                    value={responseSize}
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
                  {isBrowserScriptTest ? (
                    <BrowserTestTimeline
                      details={details}
                      startTime={startTime}
                      finishTime={finishTime}
                      isBrowserType={isBrowserScriptTest}
                    />
                  ) : (
                    <Timeline details={details} startTime={startTime} finishTime={finishTime} />
                  )}
                </Col>
              </Row>
              {!isHTTPActionType && (
                <Row>
                  <Col lg={12}>
                    <Logs
                      testId={testId}
                      resultId={resultId}
                      timestamp={get(head(get(details, ['data', 'subtransactions'])), 'properties.startTime')}
                      isBrowserTestType={isBrowserScriptTest}
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
