import * as ro from 'reactive-observables';

import createAxisController from 'in-charts/Chart/controller/axis';
import createDomController from 'in-charts/Chart/controller/dom';
import createAxisRenderer from 'in-charts/Chart/renderer/axis';

import './Chart.less';

export default function createChart(config) {
  config.subscriptions = [];
  config.margins = calculateMargins();

  const domController = createDomController(config);
  const axisController = createAxisController(config);

  const axisRenderer = createAxisRenderer(config);

  addWindowResizeSupport();
  resize();

  return {
    dispose
  };


  function dispose() {
    domController.dispose();
    config.subscriptions.forEach(s => s.dispose());
  }


  function calculateMargins() {
    const givenMargins = config.margins || {};
    return {
      top: 1,
      bottom: 1,
      left: givenMargins.left || 1,
      right: givenMargins.right || 1
    };
  }


  function resize() {
    domController.resize();
    axisController.resize();

    render();
  }


  function addWindowResizeSupport() {
    config.subscriptions.push(ro
      .on(window, 'resize')
      .debounce(500)
      .subscribe(resize));
  }


  function render() {
    renderToBackBuffer();

    // copy backbuffer to screenbuffer
    config.ctx.screen.drawImage(config.dom.buffer, 0, 0, config.width, config.height);
  }


  function renderToBackBuffer() {
    axisRenderer.render();
  }
}
