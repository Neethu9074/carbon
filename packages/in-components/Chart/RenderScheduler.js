import { create } from 'reactive-observables';

import { getAnimationFramesWithAnAnimationDurationOf } from 'in-services/chartRenderingAnimationFrames';
import { getAxisTickPositions } from 'in-new-components/Axis/HorizontalTimeAxis';
import renderTickLines from 'in-components/Chart/renderer/tickLines';
import timeLineRenderer from 'in-components/Chart/renderer/timeLine';
import clearRender from 'in-components/Chart/renderer/clear';
import { getAxisConfig } from 'in-charts/timeFormatting';
import { toServerTime } from 'in-stores/timeOffset';
import { copyCanvasInto } from 'in-charts/canvas';
import { offset$ } from 'in-stores/timeOffset';

export default class RenderScheduler {
  constructor(chart) {
    this.chart = chart;
    this.config = chart.config;

    this.serverTimeOffset = 0;
    this.timeOffsetSubscrtiption = offset$.subscribe(serverTimeOffset => (this.serverTimeOffset = serverTimeOffset));
    this.animateSignal$ = create();
  }

  atomicRender() {
    const config = this.config;
    const timeConfig = config.timeConfig;

    const to = toServerTime(timeConfig.to, this.serverTimeOffset);
    config.scales.xBackBuffer.setDomainFrom(to - timeConfig.windowSize);
    config.scales.xBackBuffer.setDomainTo(to);

    this.tickPositions = null;
    this.calculateTicks();
    this.render();
    this.drawBackBufferToFrontBuffer();
  }

  startLiveMode() {
    const config = this.config;
    this.stopLiveMode();

    this.setXDomainToLiveMode();

    let initialRenderDone = false;
    const animate = ({ timeSinceLastAnimationDurationPassed, progress }) => {
      this.drawBackBufferToFrontBuffer(progress);

      if (timeSinceLastAnimationDurationPassed >= config.animationDuration || !initialRenderDone) {
        config.scales.xBackBuffer.shiftDomain(timeSinceLastAnimationDurationPassed);

        // just renders the current state to the back-buffer
        this.calculateTicks();
        this.render();
        initialRenderDone = true;

        this.updateExistingTickPositions();
      }
    };

    this.updateSubscription = getAnimationFramesWithAnAnimationDurationOf(config.animationDuration).subscribe(animate);
  }

  setXDomainToLiveMode() {
    const config = this.config;
    const wiggleRoom = config.wiggleRoom;
    const now = Date.now();
    const windowSize = config.timeConfig.windowSize;
    const to = toServerTime(now, this.serverTimeOffset);
    config.scales.xBackBuffer.setDomainFrom(to - windowSize - wiggleRoom);
    config.scales.xBackBuffer.setDomainTo(to - wiggleRoom);
  }

  stopLiveMode() {
    if (this.autoUpdateHandle) {
      this.autoUpdateHandle.cancel();
      this.autoUpdateHandle = null;
    }

    if (this.updateSubscription) {
      this.updateSubscription.dispose();
      this.updateSubscription = null;
    }

    this.tickPositions = null;
  }

  intermediateRenderDuringUpdate() {
    this.render();
  }

  render() {
    const config = this.config;

    clearRender(config);
    renderTickLines(config);

    this.renderAxisMetrics('y1', config);
    this.renderAxisMetrics('y2', config);

    this.clearOverdraw(config);

    timeLineRenderer(config, this.tickPositions);
  }

  renderAxisMetrics(axisName, config) {
    const axis = config[axisName];
    if (!axis) {
      return;
    }

    const filteredIndices = this.chart.getFilteredMetricIndices(axis);

    // all metrics are filtered, so don't try to paint anything
    if (filteredIndices.length === axis.metrics.length) {
      return;
    }

    const metrics = axis.metrics.filter((series, i) => filteredIndices.indexOf(i) === -1);
    const colors = axis.colors.filter((series, i) => filteredIndices.indexOf(i) === -1);
    const colors100 = axis.colors100.filter((series, i) => filteredIndices.indexOf(i) === -1);

    if (axis.valuesNeedToBeStacked || axis.valuesDependOnEachOther) {
      axis.renderer.render({
        axis,
        metrics,
        colors,
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
          dataSeries: metrics[i],
          color: colors100[i],
          colors,
          colors100,
          scale: config.scales[axisName],
          config
        });
      }
    }
  }

  clearOverdraw(config) {
    config.clearTopOverdraw();
    config.clearBottomOverdraw();
    config.clearLeftOverdraw();
    config.clearRightOverdraw();
  }

  calculateTicks() {
    if (this.tickPositions) {
      return;
    }

    const { backBufferWidth, timeConfig } = this.config;
    if (!backBufferWidth) {
      return;
    }

    const scale = {
      from: timeConfig.to - timeConfig.windowSize,
      to: timeConfig.to
    };
    const formattingConfig = getAxisConfig(scale.to - scale.from);
    const xBackBuffer = this.config.scales.xBackBuffer;
    const fullDomain = xBackBuffer.getDomainTo() - xBackBuffer.getDomainFrom();
    this.tickPositions = getAxisTickPositions(formattingConfig, backBufferWidth, scale).map(
      tickPositionInPercent => xBackBuffer.getDomainFrom() + tickPositionInPercent * fullDomain
    );
  }

  updateExistingTickPositions() {
    if (!this.tickPositions) {
      return;
    }

    const xBackBuffer = this.config.scales.xBackBuffer;
    const from = xBackBuffer.getDomainFrom() - xBackBuffer.getDomainFrom() / 2; // give the ticks some room so they can vanish out of view nicely

    this.tickPositions = this.tickPositions.filter(tick => tick > from);
    const d = this.getDistanceBetweenTicks();
    if (!d) {
      return;
    }

    const to = xBackBuffer.getDomainTo();
    const lastTick = this.tickPositions[this.tickPositions.length - 1];
    const ticksToAdd = Math.floor((to - lastTick) / d);
    for (let i = 0; i < ticksToAdd; i++) {
      this.tickPositions.push(lastTick + (i + 1) * d);
    }
  }

  getDistanceBetweenTicks() {
    // you need at least two points to calculate a distance
    if (!this.tickPositions || this.tickPositions.length < 2) {
      return null;
    }
    return this.tickPositions[1] - this.tickPositions[0];
  }

  drawBackBufferToFrontBuffer(progress = 1) {
    progress = Math.min(1, progress);
    const config = this.config;
    const dpr = config.devicePixelRatio;

    copyCanvasInto(
      config.backBufferCanvas,
      config.frontBufferCtx,
      Math.round(progress * config.bufferOffsetInPx * dpr),
      0,
      Math.round(config.frontBufferWidth * dpr),
      Math.round(config.height * dpr),
      0,
      0,
      config.frontBufferWidth,
      config.height
    );
  }

  dispose() {
    this.stopLiveMode();

    this.timeOffsetSubscrtiption.dispose();
    this.timeOffsetSubscrtiption = null;
  }
}
