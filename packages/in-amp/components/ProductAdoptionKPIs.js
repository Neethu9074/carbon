/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import SparkChart from 'in-components/SparkChart';
import { t } from 'in-i18n';

import locals from './ProductAdoptionKPIs.mless';

/**
 * Renders the product adoption KPIs, if sparkchart data is supplied.
 * @param {object} accountInfo The retrieved account information, including the sparkchart data.
 */
export default function ProductAdoptionKPIsWrapper({ accountInfo }) {
  const sparkchartMetrics = accountInfo?.data?.sparkchartMetrics;
  if (!sparkchartMetrics || Object.keys(sparkchartMetrics).length === 0) {
    return null;
  }
  return <ProductAdoptionKPIs sparkchartMetrics={sparkchartMetrics} />;
}

const KPI_ORDER = [
  ['applications', 'reportingapplications', 'websites'],
  ['all_alerts', 'active_alerts', 'mobile_apps'],
  ['alert_channels', 'custom_dashboards', 'releases']
];

/**
 * The product adoption KPIs, as multiple large numbers with a label.
 * @param {object} accountInfo The retrieved account information, including the sparkchart data.
 */
function ProductAdoptionKPIs({ sparkchartMetrics }) {
  return (
    <div>
      {KPI_ORDER.map(kpiRow => (
        <Row key={kpiRow.join()}>
          {kpiRow.map(kpi => {
            const sortedMetrics = getSortedSparkchartMetrics(sparkchartMetrics[kpi]);
            const metricsPresent = sortedMetrics?.length > 0;

            const timeConfig = metricsPresent
              ? {
                  windowSize: sortedMetrics[sortedMetrics.length - 1].time - sortedMetrics[0].time,
                  to: sortedMetrics[sortedMetrics.length - 1].time
                }
              : null;
            return (
              <Col key={kpi} xs={4}>
                <div className={locals.kpiContainer}>
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
                  {metricsPresent && (
                    <SparkChart
                      timeConfig={timeConfig}
                      metrics={sortedMetrics.map(metrics => [metrics.time, metrics.value])}
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

/**
 * Sorts the retrieved sparkchart metrics by time.
 * @param {string} metrics The sparkchart metrics to be sorted.
 * @returns The sparkchart metrics, sorted by time ascending.
 */
function getSortedSparkchartMetrics(metrics) {
  if (!metrics) {
    return null;
  }
  return [...metrics].sort((a, b) => a.time - b.time);
}
