/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  InputMetrics,
  Metrics,
  getName,
  metricsFilteredOnHighlightedTimeframe
} from 'in-components/Chart/components/ContextMenu/actions/download';
import { HighlightedTimeframe } from 'in-stores/highlightedTimeframe';
import { t } from 'in-i18n';

const config = {
  name: 'download',
  icon: 'lib_actions_download',
  label: t('in-components:chart.chartDownloadLabel'),
  onClick: download
};
export default config;

function download(metrics: InputMetrics, highlightedTimeframe: HighlightedTimeframe) {
  const data = metricsFilteredOnHighlightedTimeframe(metrics, highlightedTimeframe);
  const a = document.body.appendChild(document.createElement('a'));
  a.download = getName(metrics) + '.json';
  a.href = `data:text/json;charset=utf-8,${encodeURIComponent(getJsonData(data))}`;
  a.click();
  document.body.removeChild(a);
}

function getJsonData(data: Metrics): string {
  return JSON.stringify(data, null, 2);
}
