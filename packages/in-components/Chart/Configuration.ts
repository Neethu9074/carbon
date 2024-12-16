/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { assign } from 'lodash';

import { create, Subject } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import {
  Axis,
  AxisConfiguration,
  ChartConfig,
  Config as CombinedChartConfig,
  DatapointsDistancePerSeries,
  Formatter,
  FormatterObject,
  MetricDataSeries
} from 'in-components/Chart/types';
import {
  allowedMillisGapsInOneSecondResolution,
  allowedMultiplesOfRollupSizeMissingInCharts
} from 'in-services/featureFlags';
import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import { collectAllDomainValues } from 'in-components/Chart/data/dataSearchUtils';
import { enrichAxisWithColors } from 'in-components/Chart/strokeColors';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { HighlightedTimeframe } from 'in-stores/highlightedTimeframe';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getInfraGranularity } from 'in-stores/metric';
import { number } from 'in-services/formatters/number';
import Scales from 'in-components/Chart/Scales';
import { Nullish } from 'in-types';

// Hard real time is hard. We are always 2-3 seconds behing the current server time in terms
// of availability of metrics. We are removing x millis from the right border in order to
// hide this fact from the user.
export const WIGGLE_ROOM = 5000;

export const ANIMATION_DURATION = 1000;

export type MetricsFilterKey = 'defaultDisabledMetrics' | 'forceDisabledMetrics';

interface ConfigProps extends CombinedChartConfig {
  height: number;
}

export default class Config {
  timeAxisHeight: number;
  markerPaneHeight: number;
  height?: number;
  width?: number;

  localHighlightedTimeframe$: Subject<HighlightedTimeframe>;
  localZoomedTimeframe$: Subject<HighlightedTimeframe>;

  filteredDataSeries$: Subject<Set<string>>;
  filteredDataSeries: Set<string>;
  userFilteredDataSeries: Set<string>;
  forceFilteredDataSeries: Set<string> = new Set();

  granularity?: number;
  rollup?: number;
  rollupLabel?: string | Nullish;

  timeConfig?: TimeConfig;

  distanceBetweenDatapointsInMillis?: number;
  maxDistanceBetweenDatapoints?: number;
  maxDistanceBetweenDatapointsInMillis?: number;

  y1?: Axis;
  y2?: Axis;

  y1$: Subject<Axis | undefined>;
  y2$: Subject<Axis | undefined>;

  scales?: Scales;

  allDomainValues?: number[] | Nullish;

  shareMaxAxisDomain?: boolean;

  wiggleRoom?: number;

  constructor(props: ConfigProps) {
    this.timeAxisHeight = 30;
    this.markerPaneHeight = 22;

    // This is used to handle the overlay when you select on a chart
    this.localHighlightedTimeframe$ = create<HighlightedTimeframe>().emit(null);
    // This is used to handle the zooming, when selecting on a chart and zooming into the selected timeframe
    this.localZoomedTimeframe$ = create<HighlightedTimeframe>().emit(null);

    this.filteredDataSeries$ = create();
    this.filteredDataSeries = new Set();
    this.userFilteredDataSeries = this.getFilteredMetrics(props, 'defaultDisabledMetrics');

    this.y1$ = create<Axis | undefined>().emit(undefined);
    this.y2$ = create<Axis | undefined>().emit(undefined);

    this.update(props);
  }

  getFilteredMetrics(props: ConfigProps, key: MetricsFilterKey): Set<string> {
    let filteredMetrics = this.getMetricsForAxis('y1', props.y1, key);
    if (props.y2) {
      filteredMetrics = filteredMetrics.concat(this.getMetricsForAxis('y2', props.y2, key));
    }
    return new Set(filteredMetrics);
  }

  getMetricsForAxis(axisName: string, axis: AxisConfiguration, key: MetricsFilterKey): string[] {
    const disabledLabels = [];
    if (axis[key]) {
      for (let mId = 0; mId < axis.metricIds.length; mId++) {
        if (axis[key]!.indexOf(axis.metricIds[mId]) >= 0) {
          disabledLabels.push(`${axisName}-${mId}`);
        }
      }
    }
    return disabledLabels;
  }

  updateFilteredDataSeries(): void {
    this.filteredDataSeries.clear();
    for (const label of this.userFilteredDataSeries) {
      this.filteredDataSeries.add(label);
    }
    for (const label of this.forceFilteredDataSeries) {
      this.filteredDataSeries.add(label);
    }
    this.filteredDataSeries$.emit(this.filteredDataSeries);
  }

  isFiltered(axisName: string, index: number): boolean {
    return this.filteredDataSeries.has(`${axisName}-${index}`);
  }

  update(props: ConfigProps): void {
    assign(this, props);
    this.enrichConfig();

    this.forceFilteredDataSeries = this.getFilteredMetrics(props, 'forceDisabledMetrics');
    this.updateFilteredDataSeries();

    if (!this.scales) {
      this.scales = new Scales(this, this.filteredDataSeries);
    }
    this.scales.update();
    this.emitAxisUpdates();
  }

  calculateMaxMillisBetweenDatapoints(): number {
    const maxMillisFromDistance = this.distanceBetweenDatapointsInMillis
      ? this.distanceBetweenDatapointsInMillis * allowedMultiplesOfRollupSizeMissingInCharts
      : 0;
    const maxMillisFromRollup =
      this.rollup === 1000
        ? allowedMillisGapsInOneSecondResolution
        : this.rollup! * allowedMultiplesOfRollupSizeMissingInCharts;
    return Math.max(maxMillisFromDistance, maxMillisFromRollup);
  }

  enrichConfig(): void {
    if (this.granularity) {
      this.rollup = this.granularity;
      this.rollupLabel = formatDurationAccurately(this.rollup, 100);
    } else {
      this.rollup = getInfraGranularity(this.timeConfig!);
      this.rollupLabel = formatDurationAccurately(this.rollup, 100);
    }

    this.maxDistanceBetweenDatapointsInMillis = this.calculateMaxMillisBetweenDatapoints();

    this.enrichAxis(this.y1);
    this.enrichAxis(this.y2);

    this.determineSeriesColors();

    this.allDomainValues = null;
  }

  enrichAxis(axis?: Axis): void {
    if (!axis) {
      return;
    }

    axis.numOfSeries = axis.labels ? axis.labels.length : 0;
    axis.formatter = this.getFormatterForAxis(axis);
    axis.renderer = axis.renderer || Renderer.line;

    if (axis.renderer.enrich) {
      axis.renderer.enrich(this, axis);
    }

    const { metricsConfiguration } = this as ChartConfig;

    if (metricsConfiguration) {
      axis.distanceBetweenDatapointsInMillis = {} as DatapointsDistancePerSeries;
      Object.entries(metricsConfiguration?.metrics)?.forEach(
        ([metricId, metric]) =>
          (axis.distanceBetweenDatapointsInMillis![metricId] = metric.pollRate
            ? Math.max(metric.pollRate, this.maxDistanceBetweenDatapointsInMillis!)
            : this.maxDistanceBetweenDatapointsInMillis!)
      );
    }
  }

  getFormatterForAxis(axis: AxisConfiguration & { numOfSeries: number }): FormatterObject[] {
    if (axis.numOfSeries === 0) {
      return [number];
    } else if (Array.isArray(axis.formatter)) {
      return axis.formatter;
    }
    const formatter: FormatterObject[] = [];
    for (let i = 0; i < axis.numOfSeries; i++) {
      const f = axis.formatter || number;
      const isObject = isFormatterObject(f);
      formatter.push({
        compact: isObject ? f.compact : f,
        detailed: isObject ? f.detailed : f
      });
    }
    return formatter;
  }

  addBlockSizeMillisForAxis(axis: Axis): void {
    if (this.granularity != null) {
      // Enforce granularity if explicitly requested
      axis.dynamicCalculatedBlockSizeMillis = this.granularity;
    } else {
      // Otherwise, fallback to the pre-defined granularities
      const blockSizeMillis = getBlockSizeMillis({
        windowSize: this.timeConfig!.windowSize,
        maxDataPoints: axis.maxDataPoints,
        minPixelsPerBlock: axis.minPixelsPerBlock || 1,
        width: this.width!
      });
      axis.dynamicCalculatedBlockSizeMillis = getPredefinedBlockSizeMillisForBlockSize(blockSizeMillis);
    }
  }

  determineSeriesColors(): void {
    enrichAxisWithColors(this.y1!);

    if (this.y2) {
      enrichAxisWithColors(this.y2, this.y1!.numOfSeries);
    }
  }

  clearLocalHighlightedTimeframe(): void {
    this.localHighlightedTimeframe$.emit(null);
  }

  setLocalHighlightedtimeframe(t1: number, t2: number): void {
    this.localHighlightedTimeframe$.emit([Math.min(t1, t2), Math.max(t1, t2)]);
  }

  setLocalZoomedTimeframe(t1: number, t2: number): void {
    this.localZoomedTimeframe$.emit([Math.min(t1, t2), Math.max(t1, t2)]);
  }

  getAllDomainValues() {
    if (!this.allDomainValues) {
      this.allDomainValues = collectAllDomainValues(this);
    }
    return this.allDomainValues;
  }

  calculateBlocks(dataSeries: MetricDataSeries, distanceBetweenDatapointsInMillis: number) {
    const blocks: MetricDataSeries[] = [];
    if (dataSeries.length === 0) {
      return blocks;
    }

    let currentBlock: MetricDataSeries = [];
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
        isEndOfBlock =
          nextDataPoint[0] - dataPoint[0] >
          (distanceBetweenDatapointsInMillis ?? this.maxDistanceBetweenDatapointsInMillis!);
      }

      if (isEndOfBlock) {
        currentBlock = [];
        blocks.push(currentBlock);
      }
    }

    return blocks.filter(block => block.length !== 0);
  }

  toggleDataSeries(label: string): void {
    if (this.userFilteredDataSeries.has(label)) {
      this.userFilteredDataSeries.delete(label);
    } else {
      this.userFilteredDataSeries.add(label);
    }
    this.updateFilteredDataSeries();
    this.scales!.update();
    this.emitAxisUpdates();
  }

  emitAxisUpdates(): void {
    const newY1 = this.y1 ? { ...this.y1 } : undefined;
    const newY2 = this.y2 ? { ...this.y2 } : undefined;

    this.y1$.emit(newY1);
    this.y2$.emit(newY2);
  }
}

function isFormatterObject(f: Formatter): f is FormatterObject {
  return typeof f !== 'function';
}
