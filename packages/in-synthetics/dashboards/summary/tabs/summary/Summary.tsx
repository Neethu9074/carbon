/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { useLocation } from 'react-router';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';

import ResultsTopList from 'in-synthetics/dashboards/summary/tabs/summary/components/ResultsTopList';
import ResponseTime from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseTime';
import Failures from 'in-synthetics/dashboards/summary/tabs/summary/components/Failures';
import { bytes, meanLatency, number, percentage } from 'in-services/formatters/number';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { dummyTest } from 'in-synthetics/utils/constants';
import ResponseStatus from './components/ResponseStatus';
import { Col, Row } from 'in-components/layout/Grid';
import ResponseSize from './components/ResponseSize';
import { getTest } from 'in-synthetics/api';
import { t } from 'in-i18n';

export default function Summary() {
  const timeShiftConfig = useTimeShiftConfig();
  const location = useLocation();
  const testId = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  let test = useObservable<any, []>(() => getTest(testId), []) || dummyTest;
  let testType = get(test, ['data', 'configuration', 'syntheticType']);
  let renderPie = testType === 'HTTPAction' ? true : false;

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
      </Row>
      <Row>
        <Col lg={renderPie ? 4 : 6}>
          <ResponseSize test={test} timeShiftConfig={timeShiftConfig} />
        </Col>
        <Col lg={renderPie ? 4 : 6}>
          <ResultsTopList testId={testId} />
        </Col>
        {renderPie && (
          <Col lg={4}>
            <ResponseStatus test={test} timeShiftConfig={timeShiftConfig} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
