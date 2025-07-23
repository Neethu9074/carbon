/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { Stack, Row as CarbonRow, Column as CarbonColumn } from '@instana/carbon';
import { Typography } from '@instana/components';

import { Col as InstanaCol, Row as InstanaRow } from 'in-components/layout/Grid';
import { newAccountAndBillingPageEnabled } from 'in-services/featureFlags';
import { getChartGranularity } from 'in-stores/metric/metric';
import KpiCard from 'in-components/KpiCard/KpiCard';
import SparkChart from 'in-components/SparkChart';
import { t } from 'in-i18n';

import locals from './ProductAdoptionKPIs.mless';

/**
 * Renders the product adoption KPIs, if sparkchart data is supplied.
 * @param {object} accountInfo The retrieved account information, including the sparkchart data.
 */
export default function ProductAdoptionKPIsWrapper({ accountInfo }: any) {
  const sparkchartMetrics = accountInfo?.data?.sparkchartMetrics;
  if (!sparkchartMetrics || Object.keys(sparkchartMetrics).length === 0) {
    return null;
  }
  return <ProductAdoptionKPIs sparkchartMetrics={sparkchartMetrics} />;
}

let KPI_ORDER = [
  ['applications', 'reportingapplications', 'websites'],
  ['all_alerts', 'active_alerts', 'mobile_apps'],
  ['alert_channels', 'custom_dashboards', 'releases']
];

if (newAccountAndBillingPageEnabled)
  KPI_ORDER = [
    ['applications', 'reportingapplications', 'websites'],
    ['alert_channels', 'all_alerts', 'active_alerts'],
    ['releases', 'custom_dashboards', 'mobile_apps']
  ];

const Row = newAccountAndBillingPageEnabled ? CarbonRow : InstanaRow;
const Col = newAccountAndBillingPageEnabled ? CarbonColumn : InstanaCol;

/**
 * The product adoption KPIs, as multiple large numbers with a label.
 * @param {object} accountInfo The retrieved account information, including the sparkchart data.
 */
function ProductAdoptionKPIs({ sparkchartMetrics }: any) {
  return (
    <div>
      {KPI_ORDER.map(kpiRow => (
        <Row key={kpiRow.join()}>
          {kpiRow.map(kpi => {
            const sortedMetrics = getSortedSparkchartMetrics(sparkchartMetrics[kpi]);
            const metricsPresent = sortedMetrics?.length;

            const timeConfig = metricsPresent
              ? {
                  windowSize: sortedMetrics?.[sortedMetrics.length - 1].time - sortedMetrics?.[0].time,
                  to: sortedMetrics?.[sortedMetrics.length - 1].time,
                  autoRefresh: false
                }
              : null;
            return (
              <Col key={kpi} xs={4}>
                <div
                  className={classNames({
                    [locals.kpiContainer]: !newAccountAndBillingPageEnabled,
                    [locals.kpiContainerV2]: newAccountAndBillingPageEnabled
                  })}
                >
                  {newAccountAndBillingPageEnabled ? (
                    <Stack>
                      <Typography variant="label-01">
                        {newAccountAndBillingPageEnabled
                          ? t('in-amp:components.activationAdoption.sparkChartMetricsV2.metric', {
                              context: kpi
                            })
                          : t('in-amp:components.activationAdoption.sparkChartMetrics.metric', {
                              context: kpi
                            })}
                      </Typography>
                      <Typography variant="heading-04">
                        {sortedMetrics?.[sortedMetrics.length - 1].value || 0}
                      </Typography>
                    </Stack>
                  ) : (
                    <KpiCard
                      title={t('in-amp:components.activationAdoption.sparkChartMetrics.metric', {
                        context: kpi
                      })}
                      value={sortedMetrics?.[sortedMetrics.length - 1].value || 0}
                      shadowless
                      raw
                      valuesClassName={locals.kpiValue}
                      centerLabels
                    />
                  )}
                  {metricsPresent && timeConfig && (
                    <SparkChart
                      {...(newAccountAndBillingPageEnabled && {
                        rollup: getChartGranularity(timeConfig)
                      })}
                      timeConfig={timeConfig}
                      metrics={sortedMetrics?.map(metrics => [metrics.time, metrics.value])}
                      width={150}
                      height={70}
                    />
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
      ))}
    </div>
  );
}

interface SortedSparkchartMetricsProp {
  time: number; // Unix timestamp in milliseconds
  value: number;
}

/**
 * Sorts the retrieved sparkchart metrics by time.
 * @param {string} metrics The sparkchart metrics to be sorted.
 * @returns The sparkchart metrics, sorted by time ascending.
 */
function getSortedSparkchartMetrics(metrics: SortedSparkchartMetricsProp[]) {
  if (!metrics) {
    return null;
  }
  return [...metrics].sort((a, b) => a.time - b.time);
}
