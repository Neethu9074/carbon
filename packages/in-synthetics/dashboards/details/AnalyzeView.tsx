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
  dummyTest,
  dummyTestResultList,
  ResultDetailsResponse,
  TestResponse
} from 'in-synthetics/utils/constants';
import getTestResultSubtransactions from 'in-synthetics/subscriptions/getTestResultSubtransactions';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import StatusKpiCard from 'in-synthetics/dashboards/details/components/StatusKpiCard';
import getTestResultListStatus from 'in-synthetics/utils/getTestResultListStatus';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import FailedRun from 'in-synthetics/dashboards/details/components/FailedRun';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import Timeline from 'in-synthetics/dashboards/details/components/Timeline';
import { bytes, meanLatency, number } from 'in-services/formatters/number';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticDetailsPath } from 'in-synthetics/navigation/paths';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import Logs from 'in-synthetics/dashboards/details/components/Logs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getTest } from 'in-synthetics/api';

export default function SyntheticAnalyzeView() {
  const location = useLocation();
  const timeShiftConfig = useTimeShiftConfig();
  const timeConfig = useTimeConfig();
  let page = 1;
  let pageSize = 1;
  const testId = getMatrixParameter(location, syntheticDetailsPath, 'testId') ?? '';
  const resultId = getMatrixParameter(location, syntheticDetailsPath, 'id') ?? '';
  const start_time = +(getMatrixParameter(location, syntheticDetailsPath, 'start_time') ?? 0);
  let test: TestResponse = useObservable<any, [number]>(() => getTest(testId), [0]) || dummyTest;
  let isHTTPActionType = get(test, ['data', 'configuration', 'syntheticType']) === 'HTTPAction' ? true : false;

  let details: ResultDetailsResponse =
    useObservable<any, [number]>(
      () =>
        getTestResultSubtransactions({
          testId: testId,
          testResultId: resultId
        }),
      [0]
    ) || dummyResultDetails;

  let tagFilters = [
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

  let subTagFilters = [
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
    },
    {
      stringValue: 'SUBTRANSACTIONS',
      name: 'type',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  let resultList: Result<PaginatedResult<TestResultListItem>> =
    useObservable<any, [number]>(
      () =>
        getTestResultList({
          pagination: {
            page,
            pageSize
          },
          order: { by: 'errors', direction: 'DESC' },
          syntheticMetrics: ['errors', 'status', 'start_time', 'response_time', 'response_size'],
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
            />
            <DashboardHeaderShadowModule />
          </>
        }
      >
        {details.progress.loading || resultList.progress.loading ? (
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
              <Row>
                <Col xs>
                  <KpiCard title={t('in-synthetics:dashboard.summary.startTime')} value={formatDateTime(start_time)} />
                </Col>
                <Col xs>
                  <StatusKpiCard testId={testId} resultId={resultId} />
                </Col>
                <Col xs>
                  <KpiCard
                    title={t('in-synthetics:dashboard.summary.responseTime')}
                    value={meanLatency.detailed(get(resultList.data?.items[0], ['metrics', 'response_time', 0, 1], 0))}
                  />
                </Col>
                <Col xs style={{ display: get(details, ['errors', 0, 'code'], '') === 'NOT_FOUND' ? 'none' : 'block' }}>
                  <BigNumberKpiCard
                    title={t('in-synthetics:dashboard.summary.requests')}
                    formatter={number.compact}
                    useMaxAvailableHeight
                    config={{
                      metricConfiguration: {
                        aggregation: 'SUM',
                        metric: 'subtransaction',
                        source: 'SYNTHETICS_DETAIL',
                        // @ts-expect-error subtagFilters do not fully match the TagFilter type
                        tagFilters: subTagFilters,
                        // @ts-expect-error timeShift do not fully match the TimeShift type
                        timeShift: timeShiftConfig.offset
                      }
                    }}
                  />
                </Col>

                <Col xs>
                  <KpiCard
                    title={t('in-synthetics:dashboard.summary.responseSize')}
                    value={bytes.detailed(get(resultList.data?.items[0], ['metrics', 'response_size', 0, 1], 0))}
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
                  <Timeline
                    details={details}
                    startTime={get(resultList.data?.items[0], ['metrics', 'start_time', 0, 1], 0)}
                    finishTime={get(resultList.data?.items[0], ['metrics', 'start_time', 0, 0], 0)}
                  />
                </Col>
              </Row>
              {!isHTTPActionType && (
                <Row>
                  <Col lg={12}>
                    <Logs
                      testId={testId}
                      resultId={resultId}
                      timestamp={get(head(get(details, ['data', 'subtransactions'])), 'properties.startTime')}
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
