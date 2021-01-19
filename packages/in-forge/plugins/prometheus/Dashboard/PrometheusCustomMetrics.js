/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';

export default function PrometheusCustomMetrics({ snapshot, timeConfig, titlePrefix }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={SPECS} />;
}

const untyped = {
  prefix: 'metrics.untyped.',
  path: ['data', 'metrics.untyped'],
  type: 'untyped',
  color: '#2274A5',
  metrics: [
    {
      label: 'Value',
      formatter: withSiMultiplyPrefixThreeDecimalPlaces
    }
  ]
};

export const SPECS = [
  AVAILABLE_SPECS.COUNTER,
  AVAILABLE_SPECS.GAUGE,
  AVAILABLE_SPECS.HISTOGRAM,
  AVAILABLE_SPECS.SUMMARY,
  untyped
];
