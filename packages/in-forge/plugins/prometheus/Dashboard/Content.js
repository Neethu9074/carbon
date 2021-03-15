/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PrometheusCustomMetrics from 'in-forge/plugins/prometheus/Dashboard/PrometheusCustomMetrics';

export default function PrometheusDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <PrometheusCustomMetrics snapshot={snapshot} timeConfig={timeConfig} titlePrefix="Prometheus" />
    </div>
  );
}
