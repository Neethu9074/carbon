/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';
import { get, head } from 'lodash';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

import {
  useSyntheticContextConfiguration,
  getTestTypeTimeline,
  getSyntheticCustomMetricLabels,
  getSyntheticTagLabels
} from 'in-synthetics/dashboards/details/utils';
import {
  dummyResultDetails,
  dummyResultMetadata,
  dummyTestResultList,
  ResultDetailsResponse,
  ResultMetadataResponse
} from 'in-synthetics/utils/constants';
import { CustomPropertiesSection } from 'in-synthetics/dashboards/details/components/CustomPropertiesSection';
import SSLCertificateDetails from 'in-synthetics/dashboards/details/components/SSLCertificateDetails';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import getTestResultDetailData from 'in-synthetics/subscriptions/getTestResultDetailData';
import getTestResultListStatus from 'in-synthetics/subscriptions/getTestResultListStatus';
import { startTimeTagName, testIdTagName, testResultIdTagName } from 'in-synthetics/tags';
import DownloadButton from 'in-synthetics/dashboards/details/components/DownloadButton';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import AnalyzeViewKPIs from 'in-synthetics/dashboards/details/AnalyzeViewKPIs';
import FailedRun from 'in-synthetics/dashboards/details/components/FailedRun';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticDetailsPath } from 'in-synthetics/navigation/paths';
import isBrowserTestType from 'in-synthetics/utils/isBrowserTestType';
import Logs from 'in-synthetics/dashboards/details/components/Logs';
import { getValidFormat } from 'in-synthetics/utils/getValidFormat';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { getTestResultMetadata } from 'in-synthetics/api';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Sticky from 'in-components/Sticky';

const AnalyzeView = () => {
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
  const isBrowserTest: boolean = isBrowserTestType(testType);
  const isSSLCertificate: boolean = testType === 'SSLCertificate';
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
      (formatTypes: string[]) => {
        if (formatTypes[0] != undefined && formatTypes[0] != '') {
          return getTestResultDetailData({
            testId: testId,
            testResultId: resultId,
            type: formatTypes[0],
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
          syntheticMetrics: ['errors', 'status', 'start_time', 'response_size', 'custom_metrics', 'synthetic.tags'],
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

  return (
    <Sticky
      header={
        <>
          <DashboardHeader
            title={t('in-synthetics:dashboard.testList.mainLabel')}
            label={resultsLabel}
            withBorderBottom
            contextConfigurations={useSyntheticContextConfiguration()}
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
            <AnalyzeViewKPIs
              startTime={startTime}
              status={status}
              responseTime={responseTime}
              responseSize={responseSize}
              testType={testType}
              timelineDetails={timelineDetails}
              resultList={resultList}
            />
            {isSSLCertificate &&
              get(resultList.data?.items[0], ['metrics', 'synthetic.customMetrics.validTo', 0, 1]) && (
                <Row>
                  <Col xs>
                    <SSLCertificateDetails resultList={resultList} />
                  </Col>
                </Row>
              )}
            {(getSyntheticCustomMetricLabels(resultList, testType).length > 0 ||
              getSyntheticTagLabels(resultList).length > 0) && (
              <Row>
                <Col xs>
                  <CustomPropertiesSection resultList={resultList} testType={testType} />
                </Col>
              </Row>
            )}
            {getTestResultListStatus(resultList) !== 1 && (
              <Row>
                <Col xs>
                  <FailedRun resultList={resultList} testType={testType} />
                </Col>
              </Row>
            )}
            {!isSSLCertificate && (
              <Row>
                <Col lg={12}>{getTestTypeTimeline(isBrowserTest, timelineDetails, startTime, finishTime)}</Col>
              </Row>
            )}
            {!isHTTPActionType && !isSSLCertificate && (
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
  );
};

export default AnalyzeView;
