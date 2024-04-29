/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { formatDate } from '@instana/format-date';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import MarkerLanesSynthetic from 'in-synthetics/dashboards/summary/tabs/summary/components/MarkerLanesSynthetic';
import ResultsTopList from 'in-synthetics/dashboards/summary/tabs/summary/components/ResultsTopList';
import ResponseStatus from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseStatus';
import NetworkTimings from 'in-synthetics/dashboards/summary/tabs/summary/components/NetworkTiming';
import ResponseTime from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseTime';
import ResponseSize from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseSize';
import Failures from 'in-synthetics/dashboards/summary/tabs/summary/components/Failures';
import { bytes, meanLatency, number, percentage } from 'in-services/formatters/number';
import { TestResponse, dummyTestResultList } from 'in-synthetics/utils/constants';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { TimeShift } from 'in-components/Chart/types';
import { Location } from 'in-stores/navigation/types';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { testIdTagName } from 'in-synthetics/tags';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hours } from 'in-services/time/time';
import { t } from 'in-i18n';

interface SummaryProps {
  test: TestResponse;
}

export default function Summary({ test }: SummaryProps) {
  const page = 1;
  const pageSize = 1;
  const timeConfig = useTimeConfig();
  const timeFrameSelectedInHours = Math.floor(timeConfig.windowSize / hours.toMillis(1));
  const timeShiftConfig: TimeShift = useTimeShiftConfig();
  const location: Location = useLocation();
  const testId: string = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  const testType = getMatrixParameter(location, syntheticsDashboard, 'type');
  const isHTTPAction: boolean = testType === 'HTTPAction';
  const isSSLCertificate = testType === 'SSLCertificate';
  const locationDisplayLabels: string =
    getMatrixParameter(location, syntheticsDashboard, 'locationDisplayLabels') ?? '';
  const locationIds: string = getMatrixParameter(location, syntheticsDashboard, 'locationIds') ?? '';
  const tagFilters = [
    {
      stringValue: testId,
      name: testIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  const MarkerLanes = MarkerLanesSynthetic({ testId });

  const resultList: Result<PaginatedResult<TestResultListItem>> =
    useObservable<any, [number]>(
      () =>
        getTestResultList({
          pagination: {
            page,
            pageSize
          },
          order: { by: 'start_time', direction: 'DESC' },
          syntheticMetrics: ['custom_metrics'],
          filter: {
            timeConfig,
            includeInternalCalls: false,
            includeSyntheticCalls: false,
            useLongTermDataOnly: false
          },
          // @ts-expect-error tagFilters do not fully match the TagFilter type
          tagFilters: tagFilters //tagFilters only has test_id.
        }),
      [0]
    ) || dummyTestResultList;

  const getSSLCertificateKPICards = () => {
    const resultListItem = resultList.data?.items[0];
    return (
      <Row>
        <Col xs>
          <KpiCard
            title={t('in-synthetics:dashboard.summary.isCertificateValid')}
            value={
              get(resultListItem, ['metrics', 'synthetic.customMetrics.valid', 0, 1], 0) === 1
                ? t('in-synthetics:dashboard.summary.certificateValid')
                : t('in-synthetics:dashboard.summary.certificateNotValid')
            }
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-synthetics:dashboard.summary.daysRemaining')}
            value={get(resultListItem, ['metrics', 'synthetic.customMetrics.daysRemaining', 0, 1], 0)}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-synthetics:dashboard.summary.dateOfExpiry')}
            value={get(resultListItem, ['metrics', 'synthetic.customMetrics.validTo', 0, 1], 0)}
            renderValue={formatDate}
          />
        </Col>
      </Row>
    );
  };

  const isSSLCertificateTimeFrame: boolean = isSSLCertificate && timeFrameSelectedInHours < 24;

  return isSSLCertificateTimeFrame ? (
    <Message
      withIcon
      title={t('in-synthetics:dashboard.summary.smallerTimeFrameTitle')}
      description={t('in-synthetics:dashboard.summary.smallerTimeFrameDescription')}
      bold
    />
  ) : (
    <Fragment>
      <Row>
        <Col xs>
          <BigNumberKpiCard
            title={t('in-synthetics:dashboard.summary.successRate')}
            formatter={percentage.detailed}
            companionFormatter={v =>
              t('in-synthetics:dashboard.summary.totalRuns', {
                totalRuns: number.compact(v)
              })
            }
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'status',
                source: 'SYNTHETICS',
                tagFilters: tagFilters,
                // @ts-expect-error
                timeShift: timeShiftConfig.offset
              },
              companionMetricConfiguration: {
                aggregation: 'DISTINCT_COUNT',
                metric: 'id',
                source: 'SYNTHETICS',
                // @ts-expect-error
                tagFilters: tagFilters
              },
              // Need to add the companion metric config
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
        <Col xs>
          <BigNumberKpiCard
            title={t('in-synthetics:dashboard.summary.locations')}
            formatter={number.compact}
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'DISTINCT_COUNT',
                metric: 'location_id',
                source: 'SYNTHETICS',
                tagFilters: tagFilters,
                // @ts-expect-error
                timeShift: timeShiftConfig.offset
              },
              // Need to add the companion metric config
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
        <Col xs>
          <BigNumberKpiCard
            title={t('in-synthetics:dashboard.summary.meanResponseTime')}
            formatter={meanLatency.detailed}
            companionFormatter={v =>
              t('in-synthetics:dashboard.summary.meanLatencyFor90th', {
                meanLatencyDetail: meanLatency.detailed(v)
              })
            }
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'response_time',
                source: 'SYNTHETICS',
                tagFilters: tagFilters,
                // @ts-expect-error
                timeShift: timeShiftConfig.offset
              },
              companionMetricConfiguration: {
                aggregation: 'P90',
                metric: 'response_time',
                source: 'SYNTHETICS',
                // @ts-expect-error
                tagFilters: tagFilters
              },
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
        {!isSSLCertificate && (
          <Col xs>
            <BigNumberKpiCard
              title={t('in-synthetics:dashboard.summary.avgResponseSize')}
              formatter={bytes.detailed}
              useMaxAvailableHeight
              config={{
                metricConfiguration: {
                  aggregation: 'MEAN',
                  metric: 'response_size',
                  source: 'SYNTHETICS',
                  tagFilters: tagFilters,
                  // @ts-expect-error
                  timeShift: timeShiftConfig.offset
                },
                // Need to add the companion metric config
                comparisonDecreaseColor: 'redish',
                comparisonIncreaseColor: 'greenish'
              }}
            />
          </Col>
        )}
      </Row>
      {isSSLCertificate && !resultList.progress.loading && getSSLCertificateKPICards()}
      <Row>
        <Col xs>
          <Failures
            testId={testId}
            locationIds={locationIds}
            locationDisplayLabels={locationDisplayLabels}
            timeShiftConfig={timeShiftConfig}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        {isSSLCertificate && (
          <Col xs>
            <ResultsTopList testId={testId} />
          </Col>
        )}
        <Col xs>
          <ResponseTime
            testId={testId}
            locationIds={locationIds}
            locationDisplayLabels={locationDisplayLabels}
            timeShiftConfig={timeShiftConfig}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
        {isHTTPAction && !test.progress.loading && (
          <Col xs>
            <NetworkTimings
              testId={testId}
              locationIds={locationIds}
              locationDisplayLabels={locationDisplayLabels}
              timeShiftConfig={timeShiftConfig}
              renderPostChartContent={MarkerLanes}
            />
          </Col>
        )}
      </Row>
      <Row>
        {!test.progress.loading && (
          <>
            {!isSSLCertificate && (
              <>
                <Col lg={isHTTPAction ? 4 : 6}>
                  <ResponseSize
                    testId={testId}
                    locationIds={locationIds}
                    locationDisplayLabels={locationDisplayLabels}
                    timeShiftConfig={timeShiftConfig}
                    renderPostChartContent={MarkerLanes}
                  />
                </Col>
                <Col lg={isHTTPAction ? 4 : 6}>
                  <ResultsTopList testId={testId} />
                </Col>
              </>
            )}
          </>
        )}
        {isHTTPAction && (
          <Col lg={4}>
            <ResponseStatus test={test} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
