/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import { onPremLicenseInformationEnabled, newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import { getAccountAsResultObservable, getActiveLicensesAsResultObservable } from 'in-amp/api/account';
import RetentionAddonChart from 'in-amp/components/RetentionAddonChart';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DataIngestTable from 'in-amp/components/DataIngestTable';
import SectionLine from 'in-settings/components/SectionLine';
import { stackedArea } from 'in-stores/metric/renderer';
import UsageChart from 'in-amp/components/UsageChart';
import { Row, Col } from 'in-components/layout/Grid';
import { carbonAlert } from 'in-themes/chartColors';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-amp/pages/AccountAndBilling/AccountAndBilling.mless';

export default function UsageCharts({
  windowSize,
  timeRange,
  to,
  tenantUnit,
  showPurchasedMetric = true,
  showAggregatedMetrics = false,
  hasSyntheticAddon = false,
  hasLoggingAddon,
  presentation
}) {
  const showDataIngestTable =
    !newAccountAndBillingPageEnabled && !tenantUnit?.tenant && !onPremLicenseInformationEnabled;
  const isCumulativeTimeRange =
    presentation === 'cumulative' && (timeRange === 'this_month' || timeRange === 'last_month');
  const showTrendLine = isCumulativeTimeRange && timeRange === 'this_month';

  let showDataLicenseLine = true;
  const licenseObservableResult = useObservable(getActiveLicensesAsResultObservable(1, 60000), []);
  const accountObservableResult = useObservable(getAccountAsResultObservable(), []);

  // Show the add-on section (or not)
  const showAddOnSection =
    !newAccountAndBillingPageEnabled && showAggregatedMetrics && (hasSyntheticAddon || hasLoggingAddon);

  const fupOverride = accountObservableResult?.data?.fupOverride;

  // Calculate whether licensed data line should be shown
  // Do not show for individual tenant units
  if (tenantUnit?.tenant) {
    showDataLicenseLine = false;
  }
  // Do not show unless we are showing cumulative
  else if (!isCumulativeTimeRange) {
    showDataLicenseLine = false;
  }
  // These checks require the observable results to be there
  else {
    // Do not show, if fair use policy override is active
    if (fupOverride === true) {
      showDataLicenseLine = false;
    }

    // Do now show, if there are paid licenses with unlimited data usage
    const licenses = licenseObservableResult?.data?.items;
    if (showDataLicenseLine && licenses) {
      if (licenses.some(lic => lic?.license?.paid && lic?.license?.licenseSpecs?.limitedDataUsage !== true)) {
        showDataLicenseLine = false;
      }
    }
  }

  // Show the "Purchased" metric line only when viewing aggregated metrics and it's explicitly enabled
  const shouldShowPurchasedMetric = showAggregatedMetrics && showPurchasedMetric;

  // Data Chart Y1 definition
  let dataChartY1 = buildDataChartY1Config({
    tenantUnit,
    showTrendLine,
    isCumulativeTimeRange,
    showDataLicenseLine
  });

  // DataChartY2 definition
  let dataChartY2 = buildDataChartY2Config({
    tenantUnit,
    isCumulativeTimeRange
  });

  // APM Chart Y1 definition
  const apmChartY1 = buildHostChartConfig({
    chartType: 'apm',
    tenantUnit,
    isCumulativeTimeRange,
    showTrendLine,
    shouldShowPurchasedMetric
  });

  // IQM Chart Y1 definition
  const iqmChartsY1 = buildHostChartConfig({
    chartType: 'iqm',
    tenantUnit,
    isCumulativeTimeRange,
    showTrendLine,
    shouldShowPurchasedMetric
  });

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
      <Row className={newAccountAndBillingPageEnabled ? locals.bottomMargin : ''}>
        <Col xs={12}>
          <Card
            leftHeaderContent={
              <Stack direction="horizontal" align="center" gap="xxsmall">
                <Typography variant="heading-300" noMargin>
                  {t('in-amp:components.usageCharts.dataUsage')}
                </Typography>
                <Tooltip content={t('in-amp:components.usageCharts.dataUsageHelperText')} align="auto" legacy>
                  <SvgIcon type="lib_help_error_info_outline" size="s" color="#172429" />
                </Tooltip>
              </Stack>
            }
          >
            <UsageChart
              windowSize={windowSize}
              timeRange={timeRange}
              to={to}
              showAggregatedMetrics={showAggregatedMetrics}
              y1={dataChartY1}
              y2={dataChartY2}
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
      {showAddOnSection && (
        <>
          <SectionLine />
          <SubViewHeader>{t('in-amp:components.usageCharts.addons')}</SubViewHeader>
          {hasSyntheticAddon && (
            <Row>
              <Col xs={12}>
                <Card
                  leftHeaderContent={
                    <Stack direction="horizontal" align="center" gap="xxsmall">
                      <Typography variant="heading-300" noMargin>
                        {t('in-amp:components.usageCharts.syntheticPops')}
                      </Typography>
                      <Tooltip content={t('in-amp:components.usageCharts.syntheticsHelperText')} align="auto" legacy>
                        <SvgIcon type="lib_help_error_info_outline" size="s" color="#172429" />
                      </Tooltip>
                    </Stack>
                  }
                >
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
          )}
          {hasLoggingAddon && (
            <Row>
              <Col xs={12}>
                <RetentionAddonChart
                  onPremLicenseInformationEnabled={onPremLicenseInformationEnabled}
                  isCumulativeTimeRange={isCumulativeTimeRange}
                  tenantUnit={tenantUnit}
                  windowSize={windowSize}
                  timeRange={timeRange}
                  to={to}
                  showAggregatedMetrics={showAggregatedMetrics}
                  hasLoggingAddon={hasLoggingAddon}
                />
              </Col>
            </Row>
          )}
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

/**
 * Builds the data chart Y1 configuration
 */
function buildDataChartY1Config({ tenantUnit, showTrendLine, isCumulativeTimeRange, showDataLicenseLine }) {
  const config = {
    ...tenantUnit,
    metrics: [],
    labels: [],
    colors: [],
    formatter: 'bytes.compact'
  };

  // Add trend line if needed
  if (showTrendLine) {
    config.metrics.push('data_ingested_trend_line');
    config.labels.push(t('in-amp:components.usageCharts.trendLine'));
    config.colors.push(carbonAlert.gray60);
  }

  // Add the appropriate total metric
  if (isCumulativeTimeRange) {
    config.metrics.push('data_ingested_total_cumulative');
  } else {
    config.metrics.push('data_ingested_total');
  }
  config.labels.push('Total');
  config.colors.push(carbonAlert.blue70);

  // Add licensed data line if needed
  if (showDataLicenseLine) {
    config.metrics.push('licensed_data');
    config.labels.push('Entitled');
    config.colors.push(carbonAlert.red60);
  }

  return config;
}

/**
 * Builds the data chart Y2 configuration
 */
function buildDataChartY2Config({ tenantUnit, isCumulativeTimeRange }) {
  const config = {
    ...tenantUnit,
    renderer: stackedArea.id,
    metrics: [],
    labels: [
      [t('in-amp:components.usageCharts.infrastructure')],
      [t('in-amp:components.usageCharts.traces')],
      [t('in-amp:components.usageCharts.synthetics')],
      [t('in-amp:components.usageCharts.eumMobile')],
      [t('in-amp:components.usageCharts.eumWebsite')],
      [t('in-amp:components.usageCharts.businessMetrics')]
    ],
    formatter: 'bytes.compact'
  };

  if (isCumulativeTimeRange) {
    config.metrics.push(
      'data_ingested_infrastructure_cumulative',
      'data_ingested_traces_cumulative',
      'data_ingested_synthetics_cumulative',
      'data_ingested_eum_mobile_cumulative',
      'data_ingested_eum_website_cumulative',
      'data_ingested_business_metrics_cumulative'
    );
  } else {
    config.metrics.push(
      'bytes_ingested_infrastructure',
      'bytes_ingested_traces',
      'bytes_ingested_synthetics',
      'bytes_ingested_eum_mobile',
      'bytes_ingested_eum_website',
      'bytes_ingested_business_metrics'
    );
  }

  return config;
}

/**
 * Builds host chart configuration (APM or IQM)
 */
function buildHostChartConfig({
  chartType,
  tenantUnit,
  isCumulativeTimeRange,
  showTrendLine,
  shouldShowPurchasedMetric
}) {
  const config = {
    ...tenantUnit,
    metrics: [],
    labels: [],
    colors: []
  };

  // Define chart-specific metrics and labels
  const chartMetrics = {
    apm: {
      host: isCumulativeTimeRange ? 'apm_hosts_cumulative' : 'apmhost',
      trendLine: 'apm_hosts_trend_line',
      licensed: 'licensed_apm_hosts',
      label: t('in-amp:components.usageCharts.apmHosts')
    },
    iqm: {
      host: isCumulativeTimeRange ? 'iqm_hosts_cumulative' : 'infrahost',
      trendLine: 'iqm_hosts_trend_line',
      licensed: 'licensed_infra_hosts',
      label: t('in-amp:components.usageCharts.iqmHosts')
    }
  };

  const metrics = chartMetrics[chartType];

  // Add trend line if needed (only for cumulative time range)
  if (isCumulativeTimeRange && showTrendLine) {
    config.metrics.push(metrics.trendLine);
    config.labels.push(t('in-amp:components.usageCharts.trendLine'));
    config.colors.push(carbonAlert.gray60);
  }

  // Always add the host metric
  config.metrics.push(metrics.host);
  config.labels.push(metrics.label);
  config.colors.push(carbonAlert.blue70);

  // Add purchased metric if needed
  if (shouldShowPurchasedMetric) {
    config.metrics.push(metrics.licensed);
    config.labels.push(t('in-amp:components.usageCharts.purchased'));
    config.colors.push(carbonAlert.red60);
  }

  return config;
}
