/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import CallsPerSubtraceBigCard from 'in-applications/Dashboards/subtrace/components/CallsPerSubtraceBigCard';
import ErroneousRateBigCard from 'in-applications/Dashboards/subtrace/components/ErroneousRateBigCard';
import ErroneousRateChart from 'in-applications/Dashboards/subtrace/components/ErrenousRateChart';
import NumberOfSubtraces from 'in-applications/Dashboards/subtrace/components/NumberOfSubtraces';
import DurationMeanChart from 'in-applications/Dashboards/subtrace/components/DurationMeanChart';
import DurationBigCard from 'in-applications/Dashboards/subtrace/components/DurationBigCard';
import { Granularity, SubtraceUnifiedMetricConfiguration, TagFilter } from 'in-types';
import { Config } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { getChartGranularity } from 'in-stores/metric/metric';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Col, Row } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface Props {
  data: { id: string; name: string; tagFilterExpression: TagFilter; evaluationGranularitySeconds: number };
}

export function Summary({ data }: Props) {
  const timeConfig = useTimeConfig();
  const subtraceId = data?.id;
  const tagFilterExpression: TagFilter = {
    name: 'subtrace.config.id',
    operator: 'EQUALS',
    stringValue: subtraceId,
    entity: 'NOT_APPLICABLE',
    type: 'TAG_FILTER'
  };

  const metricConfiguration: SubtraceUnifiedMetricConfiguration = {
    aggregation: 'MEAN',
    resultType: 'SINGLE_NUMBER',
    source: 'SUBTRACE',
    timeConfig,
    tagFilterExpression,
    metric: '',
    timeShift: {
      offset: 0
    },
    queryPrecision: 'FULL'
  };
  const cardConfig: Config<SubtraceUnifiedMetricConfiguration> = {
    metricConfiguration
  };
  const granularity = getChartGranularity(timeConfig) as Granularity;

  return (
    <>
      <KpiGridRow sizes={[4, 4, 4]}>
        <CallsPerSubtraceBigCard
          config={{
            ...cardConfig,
            metricConfiguration: {
              ...cardConfig.metricConfiguration,
              metric: 'subtraceCalls',
              aggregation: 'MEAN'
            },
            companionMetricConfiguration: {
              metric: 'subtraces',
              aggregation: 'SUM',
              source: 'SUBTRACE',
              queryPrecision: 'FULL',
              tagFilterExpression,
              resultType: 'SINGLE_NUMBER',
              timeConfig: timeConfig,
              timeShift: {
                offset: 0
              }
            }
          }}
        />
        <ErroneousRateBigCard
          config={{
            ...cardConfig,
            metricConfiguration: {
              ...cardConfig.metricConfiguration,
              metric: 'subtraceErrorRate',
              aggregation: 'MEAN'
            }
          }}
        />
        <DurationBigCard
          config={{
            ...cardConfig,
            metricConfiguration: {
              ...cardConfig.metricConfiguration,
              metric: 'subtraceDuration',
              aggregation: 'MEAN'
            },
            companionMetricConfiguration: {
              metric: 'subtraceDuration',
              aggregation: 'P90',
              source: 'SUBTRACE',
              queryPrecision: 'FULL',
              tagFilterExpression,
              resultType: 'SINGLE_NUMBER',
              timeConfig: timeConfig,
              timeShift: {
                offset: 0
              }
            }
          }}
        />
      </KpiGridRow>
      <Row>
        <Col lg={4}>
          <NumberOfSubtraces
            cardTitle={t('in-applications:labelNumberOfSubtraces')}
            timeConfig={timeConfig}
            tagFilterExpression={tagFilterExpression}
            granularity={granularity}
          />
        </Col>
        <Col lg={4}>
          <ErroneousRateChart
            cardTitle={t('in-applications:labelErroneousRate')}
            timeConfig={timeConfig}
            tagFilterExpression={tagFilterExpression}
            granularity={granularity}
          />
        </Col>
        <Col lg={4}>
          <DurationMeanChart
            cardTitle={t('in-applications:labelDuration')}
            timeConfig={timeConfig}
            tagFilterExpression={tagFilterExpression}
            granularity={granularity}
          />{' '}
        </Col>
      </Row>
    </>
  );
}
