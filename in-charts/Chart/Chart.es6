import { on, create } from 'reactive-observables';
import invariant from 'invariant';

import { setHighlightedTimeframe, clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import { highlightedMoment$, clearHighlightedMoment, setHighlightedMoment } from 'in-stores/timeline';
import createHighlightedTimeframeRenderer from 'in-charts/Chart/renderer/highlightedTimeframe';
import createAnimatableContentRenderer from 'in-charts/Chart/renderer/animatableContent';
import requestAnimationFrameWithFps from 'in-charts/Chart/requestAnimationFrameWithFps';
import { allowedMultiplesOfRollupSizeMissingInCharts } from 'in-services/featureFlags';
import createTooltipRenderer from 'in-charts/Chart/renderer/tooltip';
import createApplyTimeButton from 'in-charts/Chart/applyTimeButton';
import createAxisController from 'in-charts/Chart/controller/axis';
import createBorderRenderer from 'in-charts/Chart/renderer/border';
import createDomController from 'in-charts/Chart/controller/dom';
import { toServerTime } from 'in-stores/timeOffset';
import { getSetting$ } from 'in-services/settings';

import './Chart.less';

const signalRoSpec = { emitLatestOnSubscribe: false };
const animationDuration = 2000;
const maxFps = 15;

export default function createChart(config) {
  let initPhase = true;
  config.subscriptions = [];
  config.devicePixelRatio = window.devicePixelRatio;
  config.signals = {
    restartRendering$: create(signalRoSpec)
  };

  if (__DEV__) {
    invariant(config.margins.left != null && config.margins.left, 'Left margin must always be defined!');
    invariant(
      config.y2 == null || (config.margins.right != null && config.margins.right > 0),
      'Right margin must be defined when defining a second y axis!'
    );
  }

  config.margins = {
    top: 1,
    bottom: 22,
    left: config.margins.left || 1,
    right: config.margins.right || 1
  };

  addLowDetailModeSupport();

  const domController = createDomController(config);
  const axisController = createAxisController(config);
  const animatableContentRenderer = createAnimatableContentRenderer(config);
  const borderRenderer = createBorderRenderer(config);
  const tooltipRenderer = createTooltipRenderer(config);
  const highlightedTimeframeRenderer = createHighlightedTimeframeRenderer(config);
  const applyTimeButtonRenderer = createApplyTimeButton(config);

  let isRendering = false;
  let restartRenderingSubscription;
  let renderTimeAndDataIntervalHandle;
  let animationCopyHandle;
  let timeframeHighlightDraggingStart = null;

  addWindowResizeSupport();
  addVisibilityChangeSupport();
  addTooltipSupport();
  onResize();

  initPhase = false;
  startRendering();

  return {
    dispose
  };

  function addLowDetailModeSupport() {
    config.subscriptions.push(
      getSetting$('charts_adaptToDevicePixelRatio').subscribe(adaptToDevicePixelRatio => {
        config.devicePixelRatio = adaptToDevicePixelRatio ? window.devicePixelRatio : 1;
        if (!initPhase) {
          onResize();
        }
      })
    );
  }

  function addTooltipSupport() {
    config.subscriptions.push(highlightedMoment$.throttle(20).subscribe(onHighlightedMomentChange));

    config.subscriptions.push(on(config.dom.glassPane, 'mousemove').subscribe(onMouseMove));

    config.subscriptions.push(on(config.dom.glassPane, 'mouseleave').subscribe(onMouseLeave));

    config.subscriptions.push(on(config.dom.glassPane, 'mousedown').subscribe(onMouseDown));

    config.subscriptions.push(on(config.dom.glassPane, 'mouseup').subscribe(onMouseUp));
  }

  function onMouseMove(e) {
    const time = config.scales.x.getDomain(e.offsetX);
    if (time >= config.scales.x.getDomainFrom() && time <= config.scales.x.getDomainTo()) {
      setHighlightedMoment(time);
    } else {
      clearHighlightedMoment();
    }

    if (timeframeHighlightDraggingStart != null) {
      setHighlightedTimeframe(timeframeHighlightDraggingStart, getTimeAtPosition(e.offsetX));
    }

    e.preventDefault();
  }

  function onMouseLeave() {
    clearHighlightedMoment();
    timeframeHighlightDraggingStart = null;
  }

  function onMouseDown(e) {
    e.preventDefault();

    clearHighlightedTimeframe();
    timeframeHighlightDraggingStart = getTimeAtPosition(e.offsetX);
  }

  function onMouseUp() {
    timeframeHighlightDraggingStart = null;
  }

  function getTimeAtPosition(x) {
    const time = config.scales.x.getDomain(x);
    return Math.max(Math.min(time, config.scales.x.getDomainTo()), config.scales.x.getDomainFrom());
  }

  function onHighlightedMomentChange(highlightedMoment) {
    if (highlightedMoment != null) {
      tooltipRenderer.showTooltip(highlightedMoment);
    } else {
      tooltipRenderer.hideTooltip();
    }
  }

  function dispose() {
    tooltipRenderer.dispose();
    applyTimeButtonRenderer.dispose();
    domController.dispose();
    axisController.dispose();
    stopRendering();
    config.subscriptions.forEach(s => s.dispose());
  }

  function addWindowResizeSupport() {
    config.subscriptions.push(on(window, 'resize').debounce(500).subscribe(onResize));
  }

  function onResize() {
    domController.resize();
    axisController.resize();
    restartRendering();
  }

  function addVisibilityChangeSupport() {
    config.subscriptions.push(on(document, 'visibilitychange').subscribe(onVisibilityChange));
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stopRendering();
    } else {
      restartRendering();
    }
  }

  function startRendering() {
    if (isRendering || document.hidden || initPhase) {
      return;
    }
    isRendering = true;

    restartRenderingSubscription = config.signals.restartRendering$.subscribe(restartRendering);

    calculateMaxDistanceBetweenPoints();
    borderRenderer.render();

    let prev = 0;
    const animate = () => {
      const now = Date.now();
      const scales = config.scales;
      const windowSize = config.timeframe.windowSize;
      const chartWiggleRoom = config.chartWiggleRoom;
      const to = config.timeframe.to || toServerTime(now, config.serverTimeOffset) - chartWiggleRoom;

      scales.x.setDomainFrom(to - windowSize + chartWiggleRoom);
      scales.x.setDomainTo(to);

      if (now - prev >= animationDuration) {
        scales.bufferX.setDomainFrom(to - windowSize + chartWiggleRoom);
        scales.bufferX.setDomainTo(to + animationDuration);
        scales.bufferX.setRangeTo(scales.x.getRange(to + animationDuration));

        config.ctx.staticScreen.clearRect(0, 0, config.width, config.height);
        config.ctx.animationBuffer.clearRect(0, 0, config.bufferWidth, config.height);
        borderRenderer.render();
        animatableContentRenderer.render();
        prev = now;
      }

      tooltipRenderer.repositionTooltip();
      copyBackBufferToScreenBuffer();
      highlightedTimeframeRenderer.render();
      applyTimeButtonRenderer.update();
    };

    animationCopyHandle = requestAnimationFrameWithFps(animate, maxFps);
  }

  function calculateMaxDistanceBetweenPoints() {
    const now = Date.now();
    config.scales.x.setDomainFrom(now - config.timeframe.windowSize);
    config.scales.x.setDomainTo(now);

    // The next expected point is the point at we which we would expect a next data point
    // to exist. We add a small margin to this to account for errors and delays.
    const expectedNextPoint =
      config.scales.x.getDomainFrom() + config.rollup * allowedMultiplesOfRollupSizeMissingInCharts;
    const maxDistanceBetweenPoints = config.scales.x.getRange(expectedNextPoint) - config.scales.x.getRangeFrom();
    config.maxDistanceBetweenPoints = maxDistanceBetweenPoints;
  }

  function copyBackBufferToScreenBuffer() {
    const dpr = config.devicePixelRatio;
    const x = config.scales.bufferX.getRange(config.scales.x.getDomainFrom()) - config.scales.bufferX.getRangeFrom();

    config.ctx.animationScreen.clearRect(0, 0, config.width, config.height);
    config.ctx.animationScreen.drawImage(
      config.dom.animationBuffer,
      config.margins.left * dpr + x * dpr,
      config.margins.top * dpr,
      config.width * dpr - config.margins.right * dpr - config.margins.left * dpr,
      config.height * dpr - config.margins.top * dpr,
      config.margins.left,
      config.margins.top,
      config.width - config.margins.right - config.margins.left,
      config.height - config.margins.top
    );
  }

  function stopRendering() {
    if (!isRendering) {
      return;
    }
    isRendering = false;
    if (restartRenderingSubscription) {
      restartRenderingSubscription.dispose();
      restartRenderingSubscription = null;
    }
    if (animationCopyHandle) {
      animationCopyHandle.cancel();
      animationCopyHandle = null;
    }
    clearInterval(renderTimeAndDataIntervalHandle);
  }

  function restartRendering() {
    stopRendering();
    startRendering();
  }
}
