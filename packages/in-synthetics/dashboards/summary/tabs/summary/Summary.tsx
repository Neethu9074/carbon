/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { useLocation } from 'react-router';
import React, { Fragment } from 'react';

import ResultsTopList from 'in-synthetics/dashboards/summary/tabs/summary/components/ResultsTopList';
import ResponseStatus from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseStatus';
import NetworkTimings from 'in-synthetics/dashboards/summary/tabs/summary/components/NetworkTiming';
import ResponseTime from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseTime';
import ResponseSize from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseSize';
import Failures from 'in-synthetics/dashboards/summary/tabs/summary/components/Failures';
import { bytes, meanLatency, number, percentage } from 'in-services/formatters/number';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import buildLocationsMap from 'in-synthetics/utils/buildLocationsMap';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { TestResponse } from 'in-synthetics/utils/constants';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface SummaryProps {
  test: TestResponse;
}

export default function Summary({ test }: SummaryProps) {
  const locationDisplayLabels = test.data?.locationDisplayLabels || [];
  const locations = test.data?.locations || [];
  const locationsMap =
    locationDisplayLabels.length === locations.length
      ? buildLocationsMap(locations, locationDisplayLabels)
      : new Map<string, string>();
  const timeShiftConfig = useTimeShiftConfig();
  const location = useLocation();
  const testId: string = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  const testType: boolean = getMatrixParameter(location, syntheticsDashboard, 'type') === 'HTTPAction' ? true : false;

  let tagFilters = [
    {
      stringValue: testId,
      name: 'testId',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];
  // The values in the config object passed as prop in BigNumberKpiCard
  // are just temporal values until we implement the data retreival logic.
  return (
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
                // @ts-expect-error tagFilters do not fully match the TagFilter type
                tagFilters: tagFilters,
                // @ts-ignore
                timeShift: timeShiftConfig.offset
              },
              companionMetricConfiguration: {
                aggregation: 'DISTINCT_COUNT',
                metric: 'id',
                source: 'SYNTHETICS',
                // @ts-ignore
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
                // @ts-expect-error tagFilters do not fully match the TagFilter type
                tagFilters: tagFilters,
                // @ts-ignore
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
                // @ts-expect-error tagFilters do not fully match the TagFilter type
                tagFilters: tagFilters,
                // @ts-ignore
                timeShift: timeShiftConfig.offset
              },
              companionMetricConfiguration: {
                aggregation: 'P90',
                metric: 'response_time',
                source: 'SYNTHETICS',
                // @ts-ignore
                tagFilters: tagFilters
              },
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
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
                // @ts-expect-error tagFilters do not fully match the TagFilter type
                tagFilters: tagFilters,
                // @ts-ignore
                timeShift: timeShiftConfig.offset
              },
              // Need to add the companion metric config
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <Failures test={test} timeShiftConfig={timeShiftConfig} />
        </Col>
        <Col xs>
          <ResponseTime test={test} timeShiftConfig={timeShiftConfig} />
        </Col>
        {testType && !test.progress.loading && (
          <Col xs>
            <NetworkTimings test={test} timeShiftConfig={timeShiftConfig} />
          </Col>
        )}
      </Row>
      <Row>
        {!test.progress.loading && (
          <>
            <Col lg={testType ? 4 : 6}>
              <ResponseSize test={test} timeShiftConfig={timeShiftConfig} />
            </Col>
            <Col lg={testType ? 4 : 6}>
              <ResultsTopList testId={testId} locationsMap={locationsMap} />
            </Col>
          </>
        )}
        {testType && (
          <Col lg={4}>
            <ResponseStatus test={test} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
