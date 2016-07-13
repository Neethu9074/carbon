import {updateCanvasDimensions} from 'in-charts/canvas';

const block = 'in-chart-v2';

export default function createDomController(config) {
  const height = config.height;
  const dom = config.dom = createDomElements();
  const ctx = config.ctx = {
    screen: dom.screen.getContext('2d'),
    buffer: dom.buffer.getContext('2d')
  };

  return {
    resize,
    dispose
  };


  function dispose() {
    config.container.removeChild(dom.wrapper);
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


  function resize() {
    const width = config.width = dom.wrapper.clientWidth | 0;
    config.bounds = {
      top: height - config.margins.top,
      bottom: config.margins.bottom,
      left: config.margins.left,
      right: width - config.margins.right
    };
    dom.wrapper.style.height = `${height}px`;
    updateCanvasDimensions(dom.screen, ctx.screen, width, height);
    updateCanvasDimensions(dom.buffer, ctx.buffer, width, height);
  }
}
