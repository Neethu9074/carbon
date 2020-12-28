import { create } from '@instana/observables';
import { assign } from 'lodash';
import theme from 'in-themes';

import {
  allowedMultiplesOfRollupSizeMissingInCharts,
  allowedMillisGapsInOneSecondResolution
} from 'in-services/featureFlags';
import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import { collectAllDomainValues } from 'in-components/Chart/data/dataSearchUtils';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { getDefaultMetricRollupDuration } from 'in-stores/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import Scales from 'in-components/Chart/Scales';

// Hard real time is hard. We are always 2-3 seconds behing the current server time in terms
// of availability of metrics. We are removing x millis from the right border in order to
// hide this fact from the user.
export const WIGGLE_ROOM = 5000;

export const ANIMATION_DURATION = 1000;

export default class Config {
  constructor(props) {
    this.timeAxisHeight = 30;
    this.markerPaneHeight = 22;

    this.localHighlightedTimeframe$ = create().emit(null);

    this.filteredDataSeries$ = create();
    this.filteredDataSeries = new Set();
    this.userFilteredDataSeries = this.getFilteredMetrics(props, 'defaultDisabledMetrics');

    this.update(props);
  }

  getFilteredMetrics(props, key) {
    let filteredMetrics = this.getMetricsForAxis('y1', props.y1, key);
    if (props.y2) {
      filteredMetrics = filteredMetrics.concat(this.getMetricsForAxis('y2', props.y2, key));
    }
    return new Set(filteredMetrics);
  }

  getMetricsForAxis(axisName, axis, key) {
    const disabledLabels = [];
    if (axis[key]) {
      for (let mId = 0; mId < axis.metricIds.length; mId++) {
        if (axis[key].indexOf(axis.metricIds[mId]) >= 0) {
          disabledLabels.push(`${axisName}-${mId}`);
        }
      }
    }
    return disabledLabels;
  }

  updateFilteredDataSeries() {
    this.filteredDataSeries.clear();
    for (const label of this.userFilteredDataSeries) {
      this.filteredDataSeries.add(label);
    }
    for (const label of this.forceFilteredDataSeries) {
      this.filteredDataSeries.add(label);
    }
    this.filteredDataSeries$.emit(this.filteredDataSeries);
  }

  isFiltered(axisName, index) {
    return this.filteredDataSeries.has(`${axisName}-${index}`);
  }

  update(props) {
    assign(this, props);
    this.enrichConfig();

    this.forceFilteredDataSeries = this.getFilteredMetrics(props, 'forceDisabledMetrics');
    this.updateFilteredDataSeries();

    if (!this.scales) {
      this.scales = new Scales(this, this.filteredDataSeries);
    }
    this.scales.update();
  }

  calculateMaxMillisBetweenDatapoints() {
    if (this.maxDistanceBetweenDatapoints) {
      return this.maxDistanceBetweenDatapoints;
    }
    if (this.rollup === 1000) {
      return allowedMillisGapsInOneSecondResolution;
    }
    return this.rollup * allowedMultiplesOfRollupSizeMissingInCharts;
  }

  enrichConfig() {
    if (this.granularity) {
      this.rollup = this.granularity;
      this.rollupLabel = formatDurationAccurately(this.rollup, 100);
    } else {
      const { rollup, label } = getDefaultMetricRollupDuration(this.timeConfig);
      this.rollup = rollup || 1000;
      this.rollupLabel = label;
    }

    this.maxDistanceBetweenDatapointsInMillis = this.calculateMaxMillisBetweenDatapoints();

    this.enrichAxis(this.y1);
    this.enrichAxis(this.y2);

    this.determineSeriesColors();

    this.allDomainValues = null;
  }

  enrichAxis(axis) {
    if (!axis) {
      return;
    }

    axis.numOfSeries = axis.labels ? axis.labels.length : 0;
    axis.formatter = this.getFormatterForAxis(axis);
    axis.renderer = axis.renderer || Renderer.line;

    if (axis.renderer.enrich) {
      axis.renderer.enrich(this, axis);
    }
  }

  getFormatterForAxis(axis) {
    if (axis.numOfSeries === 0) {
      return [number];
    } else if (Array.isArray(axis.formatter)) {
      return axis.formatter;
    }
    const formatter = [];
    for (let i = 0; i < axis.numOfSeries; i++) {
      const f = axis.formatter || number;
      formatter.push({
        compact: f.compact ? f.compact : f,
        detailed: f.detailed ? f.detailed : f
      });
    }
    return formatter;
  }

  addBlockSizeMillisForAxis(axis) {
    axis.dynamicCalculatedBlockSizeMillis = Math.max(
      this.granularity,
      getPredefinedBlockSizeMillisForBlockSize(
        getBlockSizeMillis({
          windowSize: this.timeConfig.windowSize,
          maxDataPoints: axis.maxDataPoints,
          minPixelsPerBlock: axis.minPixelsPerBlock || 1,
          width: this.width,
          rollup: this.granularity
        })
      )
    );
  }

  determineSeriesColors() {
    this.enrichAxisWithColors(this.y1);

    if (this.y2) {
      this.enrichAxisWithColors(this.y2, this.y1.numOfSeries);
    }
  }

  enrichAxisWithColors(axis, offset = 0) {
    if (axis.colors100) {
      return;
    }

    const colors = theme.lib.colors.chart.strokeColors25;

    axis.colors = axis.colors || [];
    axis.colors100 = [];
    for (let i = 0; i < axis.numOfSeries; i++) {
      const color = axis.colors[i] || colors[(i + offset) % colors.length];
      const { c25, c100 } = this.getColorWithTransparency(color);
      axis.colors[i] = c25;
      axis.colors100.push(c100);
    }
  }

  getColorWithTransparency(color) {
    const color25Index = theme.lib.colors.chart.strokeColors25.indexOf(color);
    if (color25Index >= 0) {
      return {
        c25: color,
        c100: theme.lib.colors.chart.strokeColors100[color25Index]
      };
    }

    const color100Index = theme.lib.colors.chart.strokeColors100.indexOf(color);
    if (color100Index >= 0) {
      return {
        c25: theme.lib.colors.chart.strokeColors25[color100Index],
        c100: color
      };
    }

    if (color === theme.lib.colors.chart.self25 || color === theme.lib.colors.chart.self100) {
      return {
        c25: theme.lib.colors.chart.self25,
        c100: theme.lib.colors.chart.self100
      };
    }

    return {
      c25: color,
      c100: color
    };
  }

  clearLocalHighlightedTimeframe() {
    this.localHighlightedTimeframe$.emit(null);
  }

  setLocalHighlightedtimeframe(t1, t2) {
    this.localHighlightedTimeframe$.emit([Math.min(t1, t2), Math.max(t1, t2)]);
  }

  getAllDomainValues() {
    if (!this.allDomainValues) {
      this.allDomainValues = collectAllDomainValues(this);
    }
    return this.allDomainValues;
  }

  calculateBlocks(dataSeries) {
    const blocks = [];
    if (dataSeries.length === 0) {
      return blocks;
    }

    let currentBlock = [];
    blocks.push(currentBlock);

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }
      currentBlock.push(dataPoint);

      const nextDataPoint = i + 1 < dataSeries.length ? dataSeries[i + 1] : dataPoint;
      let isEndOfBlock = true;
      if (nextDataPoint) {
        isEndOfBlock = nextDataPoint[0] - dataPoint[0] > this.maxDistanceBetweenDatapointsInMillis;
      }

      if (isEndOfBlock) {
        currentBlock = [];
        blocks.push(currentBlock);
      }
    }

    return blocks.filter(block => block.length !== 0);
  }

  toggleDataSeries(label) {
    if (this.userFilteredDataSeries.has(label)) {
      this.userFilteredDataSeries.delete(label);
    } else {
      this.userFilteredDataSeries.add(label);
    }
    this.updateFilteredDataSeries();
    this.scales.update();
  }
}
