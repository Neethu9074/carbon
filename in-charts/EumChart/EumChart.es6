import { on, create } from 'reactive-observables';

import { highlightedMoment$, clearHighlightedMoment, setHighlightedMoment } from 'in-stores/timeline';
import createAnimatableContentRenderer from 'in-charts/EumChart/animatableContent';
import createTooltipRenderer from 'in-charts/Chart/renderer/tooltip';
import createDomController from 'in-charts/EumChart/controller/dom';
import createAxisController from 'in-charts/Chart/controller/axis';
import { toServerTime } from 'in-stores/timeOffset';
import { getSetting$ } from 'in-services/settings';

import 'in-charts/Chart/Chart.less';

const signalRoSpec = { emitLatestOnSubscribe: false };

export default function createChart(config) {
  let isRendering = false;
  let initPhase = true;
  config.subscriptions = [];
  config.devicePixelRatio = window.devicePixelRatio;
  config.signals = {
    restartRendering$: create(signalRoSpec)
  };

  config.margins = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 10
  };

  addLowDetailModeSupport();

  const domController = createDomController(config);
  const axisController = createAxisController(config);

  const animatableContentRenderer = createAnimatableContentRenderer(config);
  const tooltipRenderer = createTooltipRenderer(config);

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

    e.preventDefault();
  }

  function onMouseLeave() {
    clearHighlightedMoment();
  }

  function onMouseDown(e) {
    e.preventDefault();
  }

  function onMouseUp() {}

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

    const render = () => {
      const now = Date.now();
      const scales = config.scales;
      const windowSize = config.timeframe.windowSize;
      const chartWiggleRoom = config.chartWiggleRoom;
      const to = config.timeframe.to || toServerTime(now, config.serverTimeOffset) - chartWiggleRoom;

      scales.x.setDomainFrom(to - windowSize + chartWiggleRoom);
      scales.x.setDomainTo(to);

      scales.bufferX.setDomainFrom(to - windowSize + chartWiggleRoom);
      scales.bufferX.setDomainTo(to);
      scales.bufferX.setRangeTo(scales.x.getRange(to));

      config.ctx.animationScreen.clearRect(0, 0, config.width, config.height);
      animatableContentRenderer.render();
      tooltipRenderer.repositionTooltip();
    };

    render();
    setInterval(render, 1000);
  }

  function stopRendering() {
    if (!isRendering) {
      return;
    }
    isRendering = false;
  }

  function restartRendering() {
    stopRendering();
    startRendering();
  }
}
