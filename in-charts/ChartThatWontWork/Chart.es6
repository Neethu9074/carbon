import * as ro from 'reactive-observables';

import createAxisController from 'in-charts/Chart/controller/axis';
import createDomController from 'in-charts/Chart/controller/dom';
import createAxisRenderer from 'in-charts/Chart/renderer/axis';
import {updateCanvasDimensions} from 'in-charts/canvas';

import './Chart.less';

export default function createChart(config) {
  config.subscriptions = [];
  config.margins = {
    top: 1,
    bottom: 22,
    left: config.margins.left || 1,
    right: config.margins.right || 1
  };

  // rendering loop specific vars
  const restartRenderingSignals$ = ro.create();
  config.scheduleRenderingRestart = () => restartRenderingSignals$.emit(true);
  const incrementalRenderSignals$ = ro.create();
  config.scheduleIncrementalRender = () => incrementalRenderSignals$.emit(true);
  let isRenderLoopActive = false;
  let incrementalRenderSignalSubscription;
  let animationIntervalHandle;

  const domController = createDomController(config);
  const axisController = createAxisController(config);

  const axisRenderer = createAxisRenderer(config);

  addWindowResizeSupport();
  addVisibilityChangeSupport();

  // start all the things
  resize();
  config.subscriptions.push(restartRenderingSignals$.subscribe(restartRenderLoop));

  return {
    dispose
  };


  function dispose() {
    domController.dispose();
    axisController.dispose();
    stopRenderLoop();
    config.subscriptions.forEach(s => s.dispose());
  }


  function resize() {
    domController.resize();
    axisController.resize();
    config.scheduleRenderingRestart();
  }


  function onVisibilityChange() {
    if (document.hidden) {
      stopRenderLoop();
    } else {
      restartRenderLoop();
    }
  }


  function addWindowResizeSupport() {
    config.subscriptions.push(ro
      .on(window, 'resize')
      .debounce(500)
      .subscribe(resize));
  }


  function addVisibilityChangeSupport() {
    config.subscriptions.push(ro
      .on(document, 'visibilitychange')
      .subscribe(onVisibilityChange));
  }


  function render() {
    log('Render', config);

    const to = config.timeframe.to || config.serverTime;
    config.scales.x.setDomainFrom(to - config.timeframe.windowSize);
    config.scales.x.setDomainTo(to);

    renderToBackBuffer();

    // copy backbuffer to screenbuffer
    config.ctx.screen.drawImage(config.dom.buffer, 0, 0, config.width, config.height);
  }


  function renderToBackBuffer() {
    log('Back Buffer Render');

    // clear buffers
    config.ctx.buffer.clearRect(0, 0, config.width, config.height);
    config.ctx.screen.clearRect(0, 0, config.width, config.height);

    // call all the renderers
    axisRenderer.render();
  }


  function moveByOneSecond() {
    log('Move by one second');
  }


  function startRenderLoop() {
    if (isRenderLoopActive) {
      return;
    }
    isRenderLoopActive = true;
    log('Start render loop');

    if (config.timeframe.to == null) {
      render();

      // special case: Add enough room for one second of additional data for animation purposes
      const additionalWidth = Math.ceil(config.scales.x.getRange(config.scales.x.getDomainTo() + 1000)
        - config.scales.x.getRangeTo());
      updateCanvasDimensions(config.dom.buffer, config.ctx.buffer, config.width + additionalWidth, config.height);

      animationIntervalHandle = setInterval(() => {
        if (config.rollup === 1000) {
          moveByOneSecond();
        } else {
          render();
        }
      }, 1000);
    } else {
      render();
    }
  }


  function stopRenderLoop() {
    if (!isRenderLoopActive) {
      return;
    }
    isRenderLoopActive = false;
    if (incrementalRenderSignalSubscription) {
      incrementalRenderSignalSubscription.dispose();
      incrementalRenderSignalSubscription = null;
    }
    clearInterval(animationIntervalHandle);
    log('Stopping render loop');
  }


  function restartRenderLoop() {
    stopRenderLoop();
    startRenderLoop();
  }

  function log(...args) {
    args.unshift(new Date(), config.serverTime);
    console.log.apply(console, args);
  }

}
