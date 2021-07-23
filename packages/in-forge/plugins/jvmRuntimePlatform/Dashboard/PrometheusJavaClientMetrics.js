/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { SPECS } from 'in-forge/plugins/prometheus/Dashboard/PrometheusCustomMetrics';

// Convert the type strings used in PrometheusCustomMetrics to standard OpenMetrics type strings
// as defined in https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#type
function toOpenMetricsTypeString(typeString) {
  switch (typeString) {
    case 'counters':
      return 'counter';
    case 'gauges':
      return 'gauge';
    case 'histograms':
      return 'histogram';
    case 'summaries':
      return 'summary';
    case 'gauge_histograms':
      return 'gaugehistogram';
    case 'statesets':
      return 'stateset';
    case 'infos':
      return 'info';
    case 'unknown':
      return 'untyped';
    default:
      return 'untyped';
  }
}

const JAVA_SPECS = SPECS.map(s =>({...s, prefix: `prometheus.metrics.${toOpenMetricsTypeString(s.prefix.slice('metrics.'.length, -1))}.`}));

export default function PrometheusJavaClientMetrics({ snapshot, timeConfig, titlePrefix }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={JAVA_SPECS} />;
}
