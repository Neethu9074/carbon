import * as ro from 'reactive-observables';

import createAxisRenderer from 'in-charts/Chart/renderer/axis';
import {updateCanvasDimensions} from 'in-charts/canvas';
import createScale from 'in-charts/scale';

import './Chart.less';

const block = 'in-chart-v2';

export default function createChart(config) {
  const subscriptions = config.subscriptions = [];
  let width = config.width = 0;
  const height = config.height;
  const margins = config.margins = calculateMargins();
  const dom = config.dom = createDomElements();
  const ctx = config.ctx = createContexts();
  const scales = config.scales = createScales();

  const axisRenderer = createAxisRenderer(config);

  addWindowResizeSupport();
  resize();

  return {
    dispose
  };


  function dispose() {
    config.container.removeChild(dom.wrapper);
    subscriptions.forEach(s => s.dispose());
  }


  function calculateMargins() {
    const givenMargins = config.margins || {};
    return {
      left: givenMargins.left || 0,
      right: givenMargins.right || 0
    };
  }


  function createDomElements() {
    const result = {
      wrapper: document.createElement('div'),
      screen: document.createElement('canvas'),
      buffer: document.createElement('canvas'),
      glassPane: document.createElement('div')
    };

    config.container.appendChild(result.wrapper);
    result.wrapper.appendChild(result.screen);
    result.wrapper.appendChild(result.glassPane);

    result.wrapper.classList.add(block);
    result.screen.classList.add(`${block}__screen`);
    result.glassPane.classList.add(`${block}__glass-pane`);

    return result;
  }


  function createContexts() {
    return {
      screen: dom.screen.getContext('2d'),
      buffer: dom.buffer.getContext('2d')
    };
  }


  function resize() {
    width = config.width = dom.wrapper.clientWidth | 0;
    config.bounds = {
      top: height,
      bottom: 0,
      left: margins.left,
      right: width - margins.right
    };
    dom.wrapper.style.height = `${height}px`;
    updateCanvasDimensions(dom.screen, ctx.screen, width, height);
    updateCanvasDimensions(dom.buffer, ctx.buffer, width, height);

    scales.x.setRangeFrom(margins.left);
    scales.x.setRangeTo(width - margins.right);
    scales.y1.setRangeFrom(height);
    if (scales.y2) {
      scales.y2.setRangeFrom(height);
    }

    render();
  }


  function addWindowResizeSupport() {
    subscriptions.push(ro
      .on(window, 'resize')
      .debounce(500)
      .subscribe(resize));
  }


  function createScales() {
    const result = {};

    result.x = createScale();
    result.y1 = createScale();
    result.y1.setRangeTo(0);

    if (config.y2) {
      result.y2 = createScale();
      result.y2.setRangeTo(0);
    }

    return result;
  }


  function render() {
    renderToBackBuffer();

    // copy backbuffer to screenbuffer
    ctx.screen.drawImage(dom.buffer, 0, 0, width, height);
  }


  function renderToBackBuffer() {
    axisRenderer.render();
  }
}
