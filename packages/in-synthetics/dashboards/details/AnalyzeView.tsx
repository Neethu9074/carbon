/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useLocation } from 'react-router';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { formatDateTime } from '@instana/format-date';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { dummyResultDetails, dummyTest, ResultDetailsResponse, TestResponse } from 'in-synthetics/utils/constants';
import getTestResultSubtransactions from 'in-synthetics/subscriptions/getTestResultSubtransactions';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import FailedRun from 'in-synthetics/dashboards/details/components/FailedRun';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import Timeline from 'in-synthetics/dashboards/details/components/Timeline';
import { bytes, meanLatency, number } from 'in-services/formatters/number';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticDetailsPath } from 'in-synthetics/navigation/paths';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { getTest } from 'in-synthetics/api';

export default function SyntheticAnalyzeView() {
  const location = useLocation();
  const timeShiftConfig = useTimeShiftConfig();
  const testId = getMatrixParameter(location, syntheticDetailsPath, 'testId') ?? '';
  const resultId = getMatrixParameter(location, syntheticDetailsPath, 'id') ?? '';
  let test: TestResponse = useObservable<any, [number]>(() => getTest(testId), [0]) || dummyTest;
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
        {details.progress.loading ? (
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
                  <BigNumberKpiCard
                    title={t('in-synthetics:dashboard.summary.startTime')}
                    formatter={formatDateTime}
                    useMaxAvailableHeight
                    config={{
                      metricConfiguration: {
                        aggregation: 'SUM',
                        metric: 'start_time',
                        source: 'SYNTHETICS',
                        // @ts-expect-error tagFilters do not fully match the TagFilter type
                        tagFilters: tagFilters,
                        // @ts-expect-error timeShift do not fully match the TimeShift type
                        timeShift: timeShiftConfig.offset
                      }
                    }}
                  />
                </Col>
                <Col xs>
                  <BigNumberKpiCard
                    title={t('in-synthetics:dashboard.summary.status')}
                    formatter={number.compact}
                    useMaxAvailableHeight
                    // color={theme.lib.colors.failure}
                    config={{
                      metricConfiguration: {
                        aggregation: 'SUM',
                        metric: 'status_code',
                        source: 'SYNTHETICS',
                        // @ts-expect-error tagFilters do not fully match the TagFilter type
                        tagFilters: tagFilters,
                        // @ts-expect-error timeShift do not fully match the TimeShift type
                        timeShift: timeShiftConfig.offset
                      }
                    }}
                  />
                </Col>
                <Col xs>
                  <BigNumberKpiCard
                    title={t('in-synthetics:dashboard.summary.responseTime')}
                    formatter={meanLatency.compact}
                    useMaxAvailableHeight
                    config={{
                      metricConfiguration: {
                        aggregation: 'MEAN',
                        metric: 'response_time',
                        source: 'SYNTHETICS',
                        // @ts-expect-error tagFilters do not fully match the TagFilter type
                        tagFilters: tagFilters,
                        // @ts-expect-error timeShift do not fully match the TimeShift type
                        timeShift: timeShiftConfig.offset
                      }
                    }}
                  />
                </Col>
                <Col xs>
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
                  <BigNumberKpiCard
                    title={t('in-synthetics:dashboard.summary.responseSize')}
                    formatter={bytes.detailed}
                    useMaxAvailableHeight
                    config={{
                      metricConfiguration: {
                        aggregation: 'MEAN',
                        metric: 'response_size',
                        source: 'SYNTHETICS',
                        // @ts-expect-error tagFilters do not fully match the TagFilter type
                        tagFilters: tagFilters,
                        // @ts-expect-error timeShift do not fully match the TimeShift type
                        timeShift: timeShiftConfig.offset
                      }
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs>
                  <FailedRun details={details} />
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Timeline details={details} />
                </Col>
              </Row>
            </Fragment>
          </LeftRightPadding>
        )}
      </Sticky>
    </>
  );
}
