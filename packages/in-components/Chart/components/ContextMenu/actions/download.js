/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

const config = {
  name: 'download',
  icon: 'lib_actions_download',
  label: t('in-components:chart.chartDownloadLabel'),
  onClick: download
};
export default config;

function download(metrics, highlightedTimeframe) {
  metrics.y1._metricValuesForDownload = metrics['y1'].metrics;

  const data = filterOnHighlightedTimeframe(highlightedTimeframe, mapMetricsToDownloadFormat(metrics));
  let fileName = metrics.cardTitle;
  if (!fileName) {
    fileName = 'metrics';
  }
  const a = document.body.appendChild(document.createElement('a'));
  a.download = fileName + '.json';
  a.href = `data:text/json;charset=utf-8,${encodeURIComponent(getJsonData(data))}`;
  a.click();
}

function filterOnHighlightedTimeframe(highlightedTimeframe, metrics) {
  if (!highlightedTimeframe) {
    return metrics;
  }

  const from = highlightedTimeframe[0];
  let to = highlightedTimeframe[1];

  const metricKeys = Object.keys(metrics);
  for (let i = 0; i < metricKeys.length; i++) {
    const metric = metricKeys[i];
    metrics[metric] = metrics[metric].filter(({ timestamp }) => timestamp >= from && timestamp <= to);
  }

  return metrics;
}

function getJsonData(data) {
  return JSON.stringify(data, null, 2);
}

function mapMetricsToDownloadFormat(metrics) {
  const values = {};
  for (let i = 0; i < metrics.y1.labels.length; i++) {
    values[metrics.y1.labels[i]] = getMetricData(metrics.y1._metricValuesForDownload[i]);
  }
  return values;
}

function getMetricData(metricValues) {
  return metricValues.map(v => ({ timestamp: v[0], value: v[1] }));
}
