import {on, create} from 'reactive-observables';

import {setHighlightedTimeframe, clearHighlightedTimeframe} from 'in-stores/timeline/highlightedTimeframe';
import {highlightedMoment$, clearHighlightedMoment, setHighlightedMoment} from 'in-stores/timeline';
import createHighlightedTimeframeRenderer from 'in-charts/Chart/renderer/highlightedTimeframe';
import createAnimatableContentRenderer from 'in-charts/Chart/renderer/animatableContent';
import requestAnimationFrameWithFps from 'in-charts/Chart/requestAnimationFrameWithFps';
import createTooltipRenderer from 'in-charts/Chart/renderer/tooltip';
import createAxisController from 'in-charts/Chart/controller/axis';
import createBorderRenderer from 'in-charts/Chart/renderer/border';
import createDomController from 'in-charts/Chart/controller/dom';
import {toServerTime} from 'in-stores/timeOffset';
import {getIn} from 'in-services/settings';

import './Chart.less';

const signalRoSpec = {emitLatestOnSubscribe: false};
const animationDuration = 2000;
const maxFps = 15;

export default function createChart(config) {
  let initPhase = true;
  config.subscriptions = [];
  config.devicePixelRatio = window.devicePixelRatio;
  config.signals = {
    restartRendering$: create(signalRoSpec)
  };
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
    config.subscriptions.push(getIn(['charts', 'adaptToDevicePixelRatio'])
      .subscribe(adaptToDevicePixelRatio => {
        config.devicePixelRatio = adaptToDevicePixelRatio ? window.devicePixelRatio : 1;
        if (!initPhase) {
          onResize();
        }
      }));
  }


  function addTooltipSupport() {
    config.subscriptions.push(highlightedMoment$
      .throttle(20)
      .subscribe(onHighlightedMomentChange));

    config.subscriptions.push(
      on(config.dom.glassPane, 'mousemove')
      .subscribe(onMouseMove));

    config.subscriptions.push(
      on(config.dom.glassPane, 'mouseleave')
      .subscribe(onMouseLeave));

    config.subscriptions.push(
      on(config.dom.glassPane, 'mousedown')
      .subscribe(onMouseDown));

    config.subscriptions.push(
      on(config.dom.glassPane, 'mouseup')
      .subscribe(onMouseUp));
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

    if (!e.shiftKey) {
      clearHighlightedTimeframe();
      return;
    }

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
    domController.dispose();
    axisController.dispose();
    stopRendering();
    config.subscriptions.forEach(s => s.dispose());
  }


  function addWindowResizeSupport() {
    config.subscriptions.push(
      on(window, 'resize')
      .debounce(500)
      .subscribe(onResize));
  }


  function onResize() {
    domController.resize();
    axisController.resize();
    restartRendering();
  }


  function addVisibilityChangeSupport() {
    config.subscriptions.push(
      on(document, 'visibilitychange')
      .subscribe(onVisibilityChange));
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

    restartRenderingSubscription = config.signals.restartRendering$
      .subscribe(restartRendering);

    calculateMaxDistanceBetweenPoints();
    borderRenderer.render();


    let prev = 0;
    const animate = () => {
      const now = Date.now();
      const to = config.timeframe.to || (toServerTime(now, config.serverTimeOffset) - config.chartWiggleRoom);
      config.scales.x.setDomainFrom(to - config.timeframe.windowSize + config.chartWiggleRoom);
      config.scales.x.setDomainTo(to);

      if (now - prev >= animationDuration) {
        config.scales.bufferX.setDomainFrom(to - config.timeframe.windowSize + config.chartWiggleRoom);
        config.scales.bufferX.setDomainTo(to + animationDuration);
        config.scales.bufferX.setRangeTo(config.scales.x.getRange(to + animationDuration));

        config.ctx.staticScreen.clearRect(0, 0, config.width, config.height);
        config.ctx.animationBuffer.clearRect(0, 0, config.bufferWidth, config.height);
        borderRenderer.render();
        animatableContentRenderer.render();
        prev = now;
      }

      tooltipRenderer.repositionTooltip();
      copyBackBufferToScreenBuffer();
      highlightedTimeframeRenderer.render();
    };

    animationCopyHandle = requestAnimationFrameWithFps(animate, maxFps);
  }


  function calculateMaxDistanceBetweenPoints() {
    const now = Date.now();
    config.scales.x.setDomainFrom(now - config.timeframe.windowSize);
    config.scales.x.setDomainTo(now);

    // The next expected point is the point at we which we would expect a next data point
    // to exist. We add a small margin to this to account for errors and delays.
    const expectedNextPoint = config.scales.x.getDomainFrom() + config.rollup * 2.3;
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
