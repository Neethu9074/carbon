/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Card } from '@instana/components';

import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DataIngestTable from 'in-amp/components/DataIngestTable';
import SectionLine from 'in-settings/components/SectionLine';
import { stackedArea } from 'in-stores/metric/renderer';
import UsageChart from 'in-amp/components/UsageChart';
import { Row, Col } from 'in-components/layout/Grid';
import { carbonAlert } from 'in-themes/chartColors';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function UsageCharts({
  windowSize,
  timeRange,
  to,
  tenantUnit,
  showPurchasedMetric = true,
  showAggregatedMetrics = false,
  hasSyntheticAddons = false,
  presentation
}) {
  const showDataIngestTable = !tenantUnit?.tenant && !onPremLicenseInformationEnabled;
  const isCumulativeTimeRange =
    presentation === 'cumulative' && (timeRange === 'this_month' || timeRange === 'last_month');
  const showTrendLine = isCumulativeTimeRange && timeRange === 'this_month';

  const dataChartY1 = tenantUnit?.tenant
    ? {
        ...tenantUnit,
        metrics: ['data_ingested_total'],
        labels: ['Total'],
        colors: [carbonAlert.blue70],
        formatter: 'bytes.compact'
      }
    : {
        ...tenantUnit,
        metrics: ['data_ingested_total'],
        labels: ['Total'],
        colors: [carbonAlert.blue70],
        formatter: 'bytes.compact'
      };

  const dataChartY2 = {
    ...tenantUnit,
    renderer: stackedArea.id,
    metrics: [
      'bytes_ingested_infrastructure',
      'bytes_ingested_traces',
      'bytes_ingested_synthetics',
      'bytes_ingested_eum_mobile',
      'bytes_ingested_eum_website'
    ],
    labels: [
      [t('in-amp:components.usageCharts.infrastructure')],
      [t('in-amp:components.usageCharts.traces')],
      [t('in-amp:components.usageCharts.synthetics')],
      [t('in-amp:components.usageCharts.eumMobile')],
      [t('in-amp:components.usageCharts.eumWebsite')]
    ],
    formatter: 'bytes.compact'
  };

  const cumulativeDataChartsY1 = {
    ...tenantUnit,
    metrics: [
      ...(showTrendLine ? ['data_ingested_trend_line'] : []),
      'data_ingested_total_cumulative',
      ...(tenantUnit?.tenant ? [] : ['licensed_data'])
    ],
    labels: [
      ...(showTrendLine ? [t('in-amp:components.usageCharts.trendLine')] : []),
      'Total',
      ...(tenantUnit?.tenant ? [] : ['Entitled Data'])
    ],
    colors: [
      ...(showTrendLine ? [carbonAlert.gray60] : []),
      carbonAlert.blue70,
      ...(tenantUnit?.tenant ? [] : [carbonAlert.red60])
    ],
    formatter: 'bytes.compact'
  };

  const cumulativeDataChartsY2 = {
    ...tenantUnit,
    renderer: stackedArea.id,
    metrics: [
      'data_ingested_infrastructure_cumulative',
      'data_ingested_traces_cumulative',
      'data_ingested_synthetics_cumulative',
      'data_ingested_eum_mobile_cumulative',
      'data_ingested_eum_website_cumulative'
    ],
    labels: [
      [t('in-amp:components.usageCharts.infrastructure')],
      [t('in-amp:components.usageCharts.traces')],
      [t('in-amp:components.usageCharts.synthetics')],
      [t('in-amp:components.usageCharts.eumMobile')],
      [t('in-amp:components.usageCharts.eumWebsite')]
    ],
    formatter: 'bytes.compact'
  };

  const apmChartY1 = isCumulativeTimeRange
    ? {
        ...tenantUnit,
        metrics: showTrendLine
          ? showPurchasedMetric
            ? ['apm_hosts_trend_line', 'apm_hosts_cumulative', 'licensed_apm_hosts']
            : ['apm_hosts_cumulative', 'apm_hosts_trend_line']
          : showPurchasedMetric
          ? ['apm_hosts_cumulative', 'licensed_apm_hosts']
          : ['apm_hosts_cumulative'],
        labels: showTrendLine
          ? [
              t('in-amp:components.usageCharts.trendLine'),
              t('in-amp:components.usageCharts.apmHosts'),
              t('in-amp:components.usageCharts.purchased')
            ]
          : [t('in-amp:components.usageCharts.apmHosts'), t('in-amp:components.usageCharts.purchased')],
        colors: showTrendLine
          ? [carbonAlert.gray60, carbonAlert.blue70, carbonAlert.red60]
          : [carbonAlert.blue70, carbonAlert.red60]
      }
    : {
        ...tenantUnit,
        metrics: showPurchasedMetric ? ['apmhost', 'licensed_apm_hosts'] : ['apmhost'],
        labels: [t('in-amp:components.usageCharts.apmHosts'), t('in-amp:components.usageCharts.purchased')],
        colors: [carbonAlert.blue70, carbonAlert.red60]
      };
  const iqmChartsY1 = isCumulativeTimeRange
    ? {
        ...tenantUnit,
        metrics: showTrendLine
          ? showPurchasedMetric
            ? ['iqm_hosts_trend_line', 'iqm_hosts_cumulative', 'licensed_infra_hosts']
            : ['iqm_hosts_trend_line', 'iqm_hosts_cumulative']
          : showPurchasedMetric
          ? ['iqm_hosts_cumulative', 'licensed_infra_hosts']
          : ['iqm_hosts_cumulative'],
        labels: showTrendLine
          ? [
              t('in-amp:components.usageCharts.trendLine'),
              t('in-amp:components.usageCharts.iqmHosts'),
              t('in-amp:components.usageCharts.purchased')
            ]
          : [t('in-amp:components.usageCharts.iqmHosts'), t('in-amp:components.usageCharts.purchased')],
        colors: showTrendLine
          ? [carbonAlert.gray60, carbonAlert.blue70, carbonAlert.red60]
          : [carbonAlert.blue70, carbonAlert.red60]
      }
    : {
        ...tenantUnit,
        metrics: showPurchasedMetric ? ['infrahost', 'licensed_infra_hosts'] : ['infrahost'],
        labels: [t('in-amp:components.usageCharts.iqmHosts'), t('in-amp:components.usageCharts.purchased')],
        colors: [carbonAlert.blue70, carbonAlert.red60]
      };

  return (
    <>
      <Row>
        <Col xs={6}>
          <Card title={t('in-amp:components.usageCharts.standard')}>
            <UsageChart
              windowSize={windowSize}
              timeRange={timeRange}
              to={to}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={apmChartY1}
              y2={getEmptyMetricConfig()}
            />
          </Card>
        </Col>
        <Col xs={6}>
          <Card title={t('in-amp:components.usageCharts.essentials')}>
            <UsageChart
              windowSize={windowSize}
              timeRange={timeRange}
              to={to}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={iqmChartsY1}
              y2={getEmptyMetricConfig()}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card>
            <SubViewHeader>
              Data usage
              <Tooltip content={t('in-amp:components.usageCharts.dataUsageHelperText')} align="rightMiddle">
                <SvgIcon type="lib_help_error_info_outline" size="s" color="#172429" />
              </Tooltip>
            </SubViewHeader>
            <UsageChart
              windowSize={windowSize}
              timeRange={timeRange}
              to={to}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={isCumulativeTimeRange ? cumulativeDataChartsY1 : dataChartY1}
              y2={isCumulativeTimeRange ? cumulativeDataChartsY2 : dataChartY2}
            />
          </Card>
        </Col>
      </Row>
      {showDataIngestTable && (
        <Row>
          <Col xs={12}>
            <DataIngestTable />
          </Col>
        </Row>
      )}
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
                  timeRange={timeRange}
                  to={to}
                  showAggregatedMetrics={showAggregatedMetrics}
                  y1={{
                    ...tenantUnit,
                    metrics: ['syntheticstotal'],
                    labels: [t('in-amp:components.usageCharts.consumedUnits')],
                    colors: ['#17A1E6']
                  }}
                  y2={{
                    ...tenantUnit,
                    metrics: ['licensed_synthetic_managed_pops'],
                    labels: [t('in-amp:components.usageCharts.resourceUnits')],
                    colors: [carbonAlert.red60]
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
