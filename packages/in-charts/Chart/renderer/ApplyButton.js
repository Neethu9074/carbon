import { combineLatest } from 'reactive-observables';
import React from 'react';

import { highlightedTimeframe$, clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import { track, TIME_WINDOW_SIZE_VIA_ZOOM } from 'in-services/tracking/tracking';
import { allowDownloadMetricsFromCharts } from 'in-services/featureFlags';
import { getFixedTimeframeUrl } from 'in-stores/timeline';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export const MAX_ZOOM_LEVEL = 1000 * 60 * 1; // 1 minute

import locals from './ApplyButton.mless';

export default connectTo(
  {
    href: combineLatest([highlightedTimeframe$, timeConfig$]).flatMap(([highlightedTimeframe, originalTimeConfig]) => {
      if (!highlightedTimeframe) {
        return alwaysNull;
      }

      const timeConfig = {
        ...originalTimeConfig
      };

      const from = highlightedTimeframe[0];
      let to = highlightedTimeframe[1];
      let windowSize = to - from;

      if (windowSize <= MAX_ZOOM_LEVEL) {
        windowSize = MAX_ZOOM_LEVEL;
      }

      if (timeConfig.focusedMoment > to || timeConfig.focusedMoment < from) {
        timeConfig.focusedMoment = to;
      }

      return getFixedTimeframeUrl({
        windowSize,
        to,
        focusedMoment: timeConfig.focusedMoment,
        clearHighlightedTimeframe: true
      });
    })
  },
  function ApplyButton({ href, metrics }) {
    if (!href) {
      return null;
    }
    return (
      <div className={locals.buttons}>
        <Button className={locals.button} kind="secondary" href={href} onClick={onZoomApplied}>
          <SvgIcon type="search" size="xxs" color="#172429" />
        </Button>
        {allowDownloadMetricsFromCharts && (
          <Button className={locals.downloadButton} kind="secondary" href={href} onClick={e => download(e, metrics)}>
            <SvgIcon type="lib_actions_download" size="xs" color="#172429" />
          </Button>
        )}
        <Button className={locals.button} kind="secondary" onClick={onButtonClicked}>
          <SvgIcon type="x" size="xxs" color="#172429" />
        </Button>
      </div>
    );
  }
);

function mapMetricsToDownloadFormat(metrics) {
  const values = {};
  for (let i = 0; i < metrics.y1.labels.length; i++) {
    values[metrics.y1.labels[i]] = getMetricData(metrics.y1._metricValuesForDownload[i]);
  }
  return values;
}

function download(e, metrics) {
  e.preventDefault();
  onButtonClicked(e);
  const data = mapMetricsToDownloadFormat(metrics);
  let fileName = metrics.cardTitle;
  if (!fileName) {
    fileName = 'metrics';
  }
  const a = document.body.appendChild(document.createElement('a'));
  a.download = fileName + '.json';
  a.href = `data:text/json;charset=utf-8,${encodeURIComponent(getJsonData(data))}`;
  a.click();
}

function getMetricData(metricValues) {
  return metricValues.map(v => ({ timestamp: v[0], value: v[1] }));
}

function getJsonData(data) {
  return JSON.stringify(data, null, 2);
}

function onZoomApplied(e) {
  onButtonClicked(e);
  track(TIME_WINDOW_SIZE_VIA_ZOOM);
}

function onButtonClicked(e) {
  e.stopPropagation();
  clearHighlightedTimeframe();
}
