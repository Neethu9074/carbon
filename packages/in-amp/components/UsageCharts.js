/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import UsageChart from 'in-amp/components/UsageChart';
import { Row, Col } from 'in-components/layout/Grid';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function UsageCharts({
  windowSize,
  tenantUnit,
  showPurchasedMetric = true,
  showAggregatedMetrics = false
}) {
  return (
    <>
      <Row>
        <Col xs={6}>
          <Card title={t('in-amp:components.usageCharts.apmUsage')}>
            <UsageChart
              windowSize={windowSize}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={{ ...tenantUnit, metrics: ['apmhost'], labels: [t('in-amp:components.usageCharts.apmHosts')] }}
              y2={
                showPurchasedMetric
                  ? {
                      ...tenantUnit,
                      metrics: ['licensed_apm_hosts'],
                      labels: [t('in-amp:components.usageCharts.purchased')],
                      colors: [theme.lib.colors.failure]
                    }
                  : getEmptyMetricConfig()
              }
            />
          </Card>
        </Col>
        <Col xs={6}>
          <Card title={t('in-amp:components.usageCharts.infrastructureUsage')}>
            <UsageChart
              windowSize={windowSize}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={{
                ...tenantUnit,
                metrics: ['infrahost'],
                labels: [t('in-amp:components.usageCharts.iqmHosts')]
              }}
              y2={
                showPurchasedMetric
                  ? {
                      ...tenantUnit,
                      metrics: ['licensed_infra_hosts'],
                      labels: [t('in-amp:components.usageCharts.purchased')],
                      colors: [theme.lib.colors.failure]
                    }
                  : getEmptyMetricConfig()
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

function getEmptyMetricConfig() {
  return {
    metrics: [],
    labels: [],
    colors: []
  };
}
