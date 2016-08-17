import * as ro from 'reactive-observables';

import createAxisController from 'in-charts/Chart/controller/axis';
import createAnimatableContentRenderer from 'in-charts/Chart/renderer/animatableContent';
import requestAnimationFrameWithFps from 'in-charts/Chart/requestAnimationFrameWithFps';
import createBorderRenderer from 'in-charts/Chart/renderer/border';
import createDomController from 'in-charts/Chart/controller/dom';
import {toServerTime} from 'in-stores/timeOffset';

import './Chart.less';

const signalRoSpec = {emitLatestOnSubscribe: false};
const animationDuration = 1000;
const maxFps = 30;

export default function createChart(config) {
  config.subscriptions = [];
  config.signals = {
    restartRendering$: ro.create(signalRoSpec)
  };
  config.margins = {
    top: 1,
    bottom: 22,
    left: config.margins.left || 1,
    right: config.margins.right || 1
  };

  const domController = createDomController(config);
  const axisController = createAxisController(config);
  const animatableContentRenderer = createAnimatableContentRenderer(config);
  const borderRenderer = createBorderRenderer(config);

  let isRendering = false;
  let restartRenderingSubscription;
  let renderTimeAndDataIntervalHandle;
  let animationCopyHandle;

  addWindowResizeSupport();
  addVisibilityChangeSupport();
  onResize();

  return {
    dispose
  };


  function dispose() {
    domController.dispose();
    axisController.dispose();
    config.subscriptions.forEach(s => s.dispose());
  }


  function addWindowResizeSupport() {
    config.subscriptions.push(ro
      .on(window, 'resize')
      .debounce(500)
      .subscribe(onResize));
  }


  function onResize() {
    domController.resize();
    axisController.resize();
    restartRendering();
  }


  function addVisibilityChangeSupport() {
    config.subscriptions.push(ro
      .on(document, 'visibilitychange')
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
    if (isRendering || document.hidden) {
      return;
    }
    isRendering = true;
    log('Starting rendering', config);

    restartRenderingSubscription = config.signals.restartRendering$
      .subscribe(restartRendering);

    calculateMaxDistanceBetweenPoints();
    borderRenderer.render();


    if (config.timeframe.to == null) {
      let prev = 0;
      const animate = () => {
        const now = Date.now();
        const to = toServerTime(now, config.serverTimeOffset);
        config.scales.x.setDomainFrom(to - config.timeframe.windowSize);
        config.scales.x.setDomainTo(to);

        if (now - prev >= animationDuration) {
          config.scales.bufferX.setDomainFrom(to - config.timeframe.windowSize);
          config.scales.bufferX.setDomainTo(to + animationDuration);
          config.scales.bufferX.setRangeTo(config.scales.x.getRange(to + animationDuration));

          config.ctx.staticScreen.clearRect(0, 0, config.width, config.height);
          config.ctx.animationBuffer.clearRect(0, 0, config.bufferWidth, config.height);
          borderRenderer.render();
          animatableContentRenderer.render();
          prev = now;
        }

        // update screen buffer x scale
        copyBackBufferToScreenBuffer();
      };

      animationCopyHandle = requestAnimationFrameWithFps(animate, maxFps);
    } else {
      // schedule copy from backbuffer to screenbuffer when data changes!
      log('Do something static');
    }
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
    const dpr = (window.devicePixelRatio || 1);
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
      config.width - config.margins.right * dpr - config.margins.left,
      config.height - config.margins.top
    );
  }


  function stopRendering() {
    if (!isRendering) {
      return;
    }
    isRendering = false;
    log('Stopping rendering');
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
    log('Restarting rendering');
    stopRendering();
    startRendering();
  }


  function log(...args) {
    args.unshift(new Date());
    console.log.apply(console, args);
  }
}
