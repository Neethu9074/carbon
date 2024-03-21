/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Card } from '@instana/components';

import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import UsageChart from 'in-amp/components/UsageChart';
import { Row, Col } from 'in-components/layout/Grid';
import { carbonAlert } from 'in-themes/chartColors';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function UsageCharts({
  windowSize,
  tenantUnit,
  showPurchasedMetric = true,
  showAggregatedMetrics = false,
  hasSyntheticAddons = false
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
                      colors: [carbonAlert.red60]
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
                      colors: [carbonAlert.red60]
                    }
                  : getEmptyMetricConfig()
              }
            />
          </Card>
        </Col>
      </Row>
      <br />
      {showAggregatedMetrics && hasSyntheticAddons && (
        <>
          <SectionLine />
          <SubViewHeader>{t('in-amp:components.usageCharts.addons')}</SubViewHeader>
          <Row>
            <Col xs={6}>
              <Card>
                <SubViewHeader>
                  {t('in-amp:components.usageCharts.syntheticPops')}
                  <Tooltip content={t('in-amp:components.usageCharts.helperText')} align="rightMiddle">
                    <SvgIcon type="lib_help_error_info_outline" size="s" color="#172429" />
                  </Tooltip>
                </SubViewHeader>
                <UsageChart
                  windowSize={windowSize}
                  showAggregatedMetrics={showAggregatedMetrics}
                  y1={{
                    ...tenantUnit,
                    metrics: ['licensed_synthetic_managed_pops'],
                    labels: [t('in-amp:components.usageCharts.resourceUnits')],
                    colors: [carbonAlert.red60]
                  }}
                  y2={{
                    ...tenantUnit,
                    metrics: ['syntheticstotal'],
                    labels: [t('in-amp:components.usageCharts.consumedUnits')],
                    colors: ['#17A1E6']
                  }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
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
