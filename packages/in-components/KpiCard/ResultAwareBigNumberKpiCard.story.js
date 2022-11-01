/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ResultAwareBigNumberKpiCard from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { fixedTimestamp } from 'in-test/util/generateMetrics';
import { getChartGranularity } from 'in-stores/metric/metric';
import { number } from 'in-services/formatters/number';

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;

export default {
  component: ResultAwareBigNumberKpiCard
};

export function MissingData() {
  return (
    <ResultAwareBigNumberKpiCard
      title="KPI card"
      config={{}}
      data={{}}
      result={{
        errors: [],
        progress: {
          loading: false
        },
        data: null
      }}
    />
  );
}

export function MissingDataRaw() {
  return (
    <ResultAwareBigNumberKpiCard
      title="KPI card"
      config={{}}
      data={{}}
      result={{
        errors: [],
        progress: {
          loading: false
        },
        data: null
      }}
      raw
    />
  );
}

export function Loading() {
  return (
    <ResultAwareBigNumberKpiCard
      title="KPI card"
      config={{}}
      data={{}}
      result={{
        errors: [],
        progress: {
          loading: true
        }
      }}
    />
  );
}

export function LoadingWithPercentage(props) {
  return (
    <ResultAwareBigNumberKpiCard
      title="KPI card"
      config={{}}
      data={{}}
      result={{
        errors: [],
        progress: {
          loading: true,
          percentage: props.percentage
        }
      }}
    />
  );
}
LoadingWithPercentage.args = {
  percentage: 0.5
};
LoadingWithPercentage.argTypes = {
  percentage: { control: { type: 'range', min: 0, max: 1, step: 0.05 } }
};

export function Simple() {
  const timeframe = generateTimeframe(oneHour);
  const granularity = getChartGranularity(timeframe);

  return (
    <ResultAwareBigNumberKpiCard
      result={{
        errors: [],
        progress: {
          loading: false
        },
        data: [{ id: 'bigNumber', values: [[1, 778502000.0]], label: '' }]
      }}
      title="KPI card"
      config={{
        granularity,
        timeConfig: timeframe
      }}
      formatter={number.compact}
    />
  );
}

export function Error() {
  return (
    <ResultAwareBigNumberKpiCard
      title="KPI card"
      result={{
        errors: [{ message: 'Some error happened.' }],
        progress: {
          loading: false
        }
      }}
      config={{}}
    />
  );
}

function generateTimeframe(windowSize) {
  return {
    windowSize,
    to: fixedTimestamp
  };
}
