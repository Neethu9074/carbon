/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import { getAccountAsResultObservable, getActiveLicensesAsResultObservable } from 'in-amp/api/account';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
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
  const showDataIngestTable = !tenantUnit?.tenant && !onPremLicenseInformationEnabled;
  const isCumulativeTimeRange =
    presentation === 'cumulative' && (timeRange === 'this_month' || timeRange === 'last_month');
  const showTrendLine = isCumulativeTimeRange && timeRange === 'this_month';

  let showDataLicenseLine = true;
  const licenseObservableResult = useObservable(getActiveLicensesAsResultObservable(1, 60000), []);
  const accountObservableResult = useObservable(getAccountAsResultObservable(), []);

  // Show the add-on section (or not)
  const showAddOnSection = showAggregatedMetrics && (hasSyntheticAddon || hasLoggingAddon);

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

  // Data Chart Y1 definition
  let dataChartY1 = {
    ...tenantUnit,
    metrics: [],
    labels: [],
    colors: [],
    formatter: 'bytes.compact'
  };

  if (showTrendLine) {
    dataChartY1.metrics.push('data_ingested_trend_line');
    dataChartY1.labels.push(t('in-amp:components.usageCharts.trendLine'));
    dataChartY1.colors.push(carbonAlert.gray60);
  }

  if (isCumulativeTimeRange) {
    dataChartY1.metrics.push('data_ingested_total_cumulative');
    dataChartY1.labels.push('Total');
    dataChartY1.colors.push(carbonAlert.blue70);
  } else {
    dataChartY1.metrics.push('data_ingested_total');
    dataChartY1.labels.push('Total');
    dataChartY1.colors.push(carbonAlert.blue70);
  }

  if (showDataLicenseLine) {
    dataChartY1.metrics.push('licensed_data');
    dataChartY1.labels.push('Entitled');
    dataChartY1.colors.push(carbonAlert.red60);
  }

  // DataChartY2 definition
  let dataChartY2 = {
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
    dataChartY2.metrics.push(
      'data_ingested_infrastructure_cumulative',
      'data_ingested_traces_cumulative',
      'data_ingested_synthetics_cumulative',
      'data_ingested_eum_mobile_cumulative',
      'data_ingested_eum_website_cumulative',
      'data_ingested_business_metrics_cumulative'
    );
  } else {
    dataChartY2.metrics.push(
      'bytes_ingested_infrastructure',
      'bytes_ingested_traces',
      'bytes_ingested_synthetics',
      'bytes_ingested_eum_mobile',
      'bytes_ingested_eum_website',
      'bytes_ingested_business_metrics'
    );
  }
  // APM Chart Y1 definition
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
  // IQM Chart Y1 definition
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
