/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  Metrics,
  InputMetrics,
  metricsFilteredOnHighlightedTimeframe,
  getName
} from 'in-components/Chart/components/ContextMenu/actions/download';
import { HighlightedTimeframe } from 'in-stores/highlightedTimeframe';
import { t } from 'in-i18n';

const config = {
  name: 'downloadCSV',
  icon: 'lib_actions_download',
  label: t('in-components:chart.chartDownloadCSVLabel'),
  onClick: download
};
export default config;

function download(metrics: InputMetrics, highlightedTimeframe: HighlightedTimeframe) {
  const data = metricsFilteredOnHighlightedTimeframe(metrics, highlightedTimeframe);
  const a = document.body.appendChild(document.createElement('a'));
  a.download = getName(metrics) + '.csv';
  a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(getCSVData(data))}`;
  a.click();
  document.body.removeChild(a);
}

function getCSVData(data: Metrics): string {
  const lines = [['series', 'timestamp', 'value']];

  for (var [key, value] of Object.entries(data)) {
    value.forEach(point => lines.push([key, point.timestamp.toString(), point.value.toString()]));
  }

  return lines.map(line => line.join(',')).join('\n');
}
