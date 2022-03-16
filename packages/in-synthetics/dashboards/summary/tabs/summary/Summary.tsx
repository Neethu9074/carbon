/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { number } from 'in-services/formatters/number';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary() {
  const timeShiftConfig = useTimeShiftConfig();

  // The values in the config object passed as prop in BigNumberKpiCard
  // are just temporal values until we implement the data retreival logic.
  return (
    <Fragment>
      <Row>
        <Col xs>
          <BigNumberKpiCard
            title={t('in-synthetics:dashboard.summary.successRate')}
            formatter={number.compact}
            useMaxAvailableHeight
            config={{
              metricConfiguration: {
                aggregation: 'MEAN',
                metric: 'status',
                resultType: 'SINGLE_NUMBER',
                source: 'APPLICATION',
                // @ts-ignore
                timeShift: timeShiftConfig.offset
              },
              tagFilter: tagFilter('status', 'EQUALS'),
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
                aggregation: 'MEAN',
                metric: 'locations',
                resultType: 'SINGLE_NUMBER',
                source: 'APPLICATION',
                // @ts-ignore
                timeShift: timeShiftConfig.offset
              },
              tagFilter: tagFilter('status', 'EQUALS'),
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
                resultType: 'SINGLE_NUMBER',
                source: 'APPLICATION',
                // @ts-ignore
                timeShift: timeShiftConfig.offset
              },
              tagFilter: tagFilter('status', 'EQUALS'),
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
                resultType: 'SINGLE_NUMBER',
                source: 'APPLICATION',
                // @ts-ignore
                timeShift: timeShiftConfig.offset
              },
              tagFilter: tagFilter('status', 'EQUALS'),
              // Need to add the companion metric config
              comparisonDecreaseColor: 'redish',
              comparisonIncreaseColor: 'greenish'
            }}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
