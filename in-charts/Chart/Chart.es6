import * as ro from 'reactive-observables';

import {updateCanvasDimensions} from 'in-charts/canvas';

import './Chart.less';

const block = 'in-chart-v2';

export default function createChart(config) {
  const margins = calculateMargins();
  const dom = createDomElements();
  const ctx = createContexts();

  resize();

  const subscriptions = establishSubscriptions();

  return {
    dispose
  };


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
    const width = dom.wrapper.clientWidth;
    const height = config.height;
    dom.wrapper.style.height = `${height}px`;
    updateCanvasDimensions(dom.screen, ctx.screen, width, height);
    updateCanvasDimensions(dom.buffer, ctx.buffer, width, height);
  }


  function establishSubscriptions() {
    const result = [];

    result.push(ro
      .on(window, 'resize')
      .debounce(500)
      .subscribe(resize));

    return result;
  }


  function dispose() {
    config.container.removeChild(dom.wrapper);
    subscriptions.forEach(s => s.dispose());
  }
}
