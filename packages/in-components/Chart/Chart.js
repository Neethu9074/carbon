/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';

import renderLocalHighlightedTimeframe from 'in-components/Chart/renderer/localHighlightedTimeframe';
import renderHighlightedTimeframe from 'in-components/Chart/renderer/highlightedTimeframe';
import DoubleBufferRenderScheduler from 'in-components/Chart/DoubleBufferRenderScheduler';
import { getAxisTickPositions } from 'in-new-components/Axis/HorizontalTimeAxis';
import { highlightedTimeframe$ } from 'in-stores/highlightedTimeframe';
import { getAxisConfig } from 'in-new-components/Axis/timeFormatting';
import renderTickLines from 'in-components/Chart/renderer/tickLines';
import renderTimeLine from 'in-components/Chart/renderer/timeLine';
import clearRender from 'in-components/Chart/renderer/clear';
import Config from 'in-components/Chart/Configuration';

const STEADY_FRAMERATE = 1000 / 30; // max FPS in ms the render scheduler renders

export default class Chart {
  constructor(canvas, props) {
    this.canvas = canvas;
    this.config = new Config(props);
    this.renderScheduler = new DoubleBufferRenderScheduler(canvas, this);

    this.combinedSubscriptions = combineLatest([
      this.config.localHighlightedTimeframe$.nextFrame().throttle(STEADY_FRAMERATE),
      highlightedTimeframe$.nextFrame().throttle(STEADY_FRAMERATE)
    ]).subscribe(([localHighlightedTimeframe, highlightedTimeframe]) => {
      this.highlightedTimeframe = highlightedTimeframe;
      this.localHighlightedTimeframe = localHighlightedTimeframe;
      this.renderScheduler.forceRender();
    });
  }

  update(props) {
    this.config.update(props);

    const { timeConfig, width, height } = this.config;
    this.renderScheduler.update(timeConfig, width, height);
  }

  atomicRender(renderProps) {
    this.calculateTicksForNonLiveMode(renderProps);
    this.render(renderProps);
  }

  stopLiveMode() {
    this.tickPositions = null;
  }

  renderAfterAnimationTimePassed(renderProps) {
    this.render(renderProps);
    this.updateExistingTickPositions(renderProps);
  }

  calculateTicksForNonLiveMode(renderProps) {
    const { backBufferWidth } = renderProps;
    const { timeConfig } = this.config;
    if (!backBufferWidth) {
      return;
    }

    const scale = {
      from: timeConfig.to - timeConfig.windowSize,
      to: timeConfig.to
    };
    const formattingConfig = getAxisConfig(scale.to - scale.from);
    const xScaleBackBuffer = renderProps.xScaleBackBuffer;
    const fullDomain = xScaleBackBuffer.getDomainTo() - xScaleBackBuffer.getDomainFrom();
    this.tickPositions = getAxisTickPositions(formattingConfig, backBufferWidth, scale).map(
      tickPositionInPercent => xScaleBackBuffer.getDomainFrom() + tickPositionInPercent * fullDomain
    );
  }

  render(renderProps) {
    const config = this.mergeConfigs(renderProps);

    clearRender(config);

    this.renderAxisMetrics('y1', config);
    this.renderAxisMetrics('y2', config);

    renderTickLines(config);

    renderLocalHighlightedTimeframe(config, this.localHighlightedTimeframe);
    renderHighlightedTimeframe(config, this.highlightedTimeframe);

    this.clearOverdraw(config);

    renderTimeLine(config, this.tickPositions);
  }

  mergeConfigs(renderProps) {
    return {
      ...this.config,
      ...renderProps,
      isFiltered: this.config.isFiltered,
      calculateBlocks: this.config.calculateBlocks
    };
  }

  renderAxisMetrics(axisName, config) {
    const axis = config[axisName];
    if (!axis) {
      return;
    }

    const filteredIndices = this.getFilteredMetricIndices(axisName, axis, config);

    // all metrics are filtered, so don't try to paint anything
    if (filteredIndices.length === axis.metrics.length) {
      return;
    }

    const metricIds = axis.metricIds?.filter((series, i) => filteredIndices.indexOf(i) === -1);
    const metrics = axis.metrics.filter((series, i) => filteredIndices.indexOf(i) === -1);
    const colors = axis.colors.filter((series, i) => filteredIndices.indexOf(i) === -1);
    const colors50 = axis.colors50.filter((series, i) => filteredIndices.indexOf(i) === -1);
    const colors100 = axis.colors100.filter((series, i) => filteredIndices.indexOf(i) === -1);

    if (axis.valuesNeedToBeStacked || axis.valuesDependOnEachOther || axis.manualRenderLoop) {
      axis.renderer.render({
        axis,
        metricIds: metricIds,
        metrics,
        colors,
        colors50,
        colors100,
        scale: config.scales[axisName],
        config
      });
    } else {
      for (let i = 0; i < metrics.length; i++) {
        const dataSeries = metrics[i];
        if (dataSeries.length === 0) {
          continue;
        }
        axis.renderer.render({
          axis,
          index: i,
          metricId: metricIds[i],
          dataSeries: metrics[i],
          color: colors100[i],
          colors,
          colors50,
          colors100,
          scale: config.scales[axisName],
          config
        });
      }
    }
  }

  getFilteredMetricIndices(axisName, axis, config) {
    const filteredIndices = [];
    for (let i = 0; i < axis.metrics.length; i++) {
      if (config.isFiltered(axisName, i)) {
        filteredIndices.push(i);
      }
    }
    return filteredIndices;
  }

  clearOverdraw(config) {
    this.clearBottomOverdraw(config);
    this.clearLeftOverdraw(config);
    this.clearRightOverdraw(config);
  }

  clearBottomOverdraw(config) {
    config.backBufferCtx.clearRect(0, config.scales.y1.getRangeFrom(), config.backBufferWidth, config.height);
  }

  clearLeftOverdraw(config) {
    config.backBufferCtx.clearRect(0, 0, config.xScaleBackBuffer.getRangeFrom(), config.height);
  }

  clearRightOverdraw(config) {
    config.backBufferCtx.clearRect(config.xScaleBackBuffer.getRangeTo(), 0, config.backBufferWidth, config.height);
  }

  updateExistingTickPositions(renderProps) {
    if (!this.tickPositions) {
      return;
    }

    const xScaleBackBuffer = renderProps.xScaleBackBuffer;
    const from =
      xScaleBackBuffer.getDomainFrom() - (xScaleBackBuffer.getDomainTo() - xScaleBackBuffer.getDomainFrom()) / 4; // give the ticks some room so they can vanish out of view nicely
    this.tickPositions = this.tickPositions.filter(tick => tick > from);

    const distanceBetweenTicks = this.getDistanceBetweenTicks(this.tickPositions);
    if (!distanceBetweenTicks) {
      // when no ticks can be calculated because there are to less datapoints, recalculate a whole set
      return this.calculateTicksForNonLiveMode(renderProps);
    }

    const to = xScaleBackBuffer.getDomainTo();
    const lastTick = this.tickPositions[this.tickPositions.length - 1];
    const ticksToAdd = Math.floor((to - lastTick) / distanceBetweenTicks);
    for (let i = 0; i < ticksToAdd; i++) {
      this.tickPositions.push(lastTick + (i + 1) * distanceBetweenTicks);
    }
  }

  getDistanceBetweenTicks(tickPositions) {
    // you need at least two points to calculate a distance
    if (!tickPositions || tickPositions.length < 2) {
      return null;
    }
    return tickPositions[1] - tickPositions[0];
  }

  dispose() {
    this.renderScheduler.dispose();
  }
}
