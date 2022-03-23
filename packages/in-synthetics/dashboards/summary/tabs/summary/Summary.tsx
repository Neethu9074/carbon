/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { useLocation } from 'react-router';
import React, { Fragment } from 'react';

import { useObservable } from '@instana/hooks';

import ResponseTime from 'in-synthetics/dashboards/summary/tabs/summary/components/ResponseTime';
import Failures from 'in-synthetics/dashboards/summary/tabs/summary/components/Failures';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { number, percentage } from 'in-services/formatters/number';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { syntheticsPath } from 'in-synthetics/navigation/paths';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { dummyTest } from 'in-synthetics/utils/constants';
import { Col, Row } from 'in-components/layout/Grid';
import { getTest } from 'in-synthetics/api';
import { t } from 'in-i18n';

export default function Summary() {
  const timeShiftConfig = useTimeShiftConfig();
  const location = useLocation();
  const testId = getMatrixParameter(location, syntheticsPath, 'testId') ?? '';
  let test = useObservable<any, []>(() => getTest(testId), []) || dummyTest;

  let tagFilters = [
    {
      stringValue: testId,
      name: 'testId',
      operator: EQUALS
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
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'status',
                source: 'SYNTHETICS',
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
            title={t('in-synthetics:dashboard.summary.locations')}
            formatter={number.compact}
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'DISTINCT_COUNT',
                metric: 'location_id',
                source: 'SYNTHETICS',
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
            formatter={number.compact}
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'response_time',
                source: 'SYNTHETICS',
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
            title={t('in-synthetics:dashboard.summary.avgResponseSize')}
            formatter={number.compact}
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'response_size',
                source: 'SYNTHETICS',
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
    </Fragment>
  );
}
