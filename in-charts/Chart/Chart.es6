import * as ro from 'reactive-observables';

import createAxisController from 'in-charts/Chart/controller/axis';
import createAnimatableContentRenderer from 'in-charts/Chart/renderer/animatableContent';
import requestAnimationFrameWithFps from 'in-charts/Chart/requestAnimationFrameWithFps';
import createBorderRenderer from 'in-charts/Chart/renderer/border';
import createDomController from 'in-charts/Chart/controller/dom';
import {toServerTime} from 'in-stores/timeOffset';

import './Chart.less';

const signalRoSpec = {emitLatestOnSubscribe: false};

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
  onResize();

  return {
    dispose
  };


  function dispose() {
    domController.dispose();
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


  function startRendering() {
    if (isRendering) {
      return;
    }
    isRendering = true;
    log('Starting rendering');

    restartRenderingSubscription = config.signals.restartRendering$
      .subscribe(restartRendering);

    borderRenderer.render();

    if (config.timeframe.to == null) {
      let prev = 0;
      const animate = () => {
        const now = Date.now();
        const to = toServerTime(now, config.serverTimeOffset);
        config.scales.x.setDomainFrom(to - config.timeframe.windowSize);
        config.scales.x.setDomainTo(to);

        if (now - prev > 900) {
          config.scales.bufferX.setDomainFrom(to - config.timeframe.windowSize);
          config.scales.bufferX.setDomainTo(to + 1000);
          config.scales.bufferX.setRangeTo(config.scales.x.getRange(to + 1000));

          config.ctx.animationBuffer.clearRect(0, 0, config.bufferWidth, config.height);
          animatableContentRenderer.render();
          prev = now;
        }

        // update screen buffer x scale
        copyBackBufferToScreenBuffer();
      };

      animationCopyHandle = requestAnimationFrameWithFps(animate, 30);
    } else {
      // schedule copy from backbuffer to screenbuffer when data changes!
      log('Do something static');
    }
  }


  function copyBackBufferToScreenBuffer() {
    config.ctx.animationScreen.clearRect(0, 0, config.width, config.height);
    const x = config.scales.bufferX.getRange(config.scales.x.getDomainFrom()) - config.scales.bufferX.getRangeFrom();
    config.ctx.animationScreen.drawImage(config.dom.animationBuffer, x * -1, 0, config.width, config.height);
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
