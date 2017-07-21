import { updateCanvasDimensions } from 'in-charts/canvas';

const block = 'in-chart';

export default function createDomController(config) {
  const height = config.height;
  const dom = (config.dom = createDomElements());
  const ctx = (config.ctx = {
    animationBuffer: dom.animationScreen.getContext('2d'),
    animationScreen: dom.animationScreen.getContext('2d')
  });

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
      animationScreen: document.createElement('canvas'),
      tooltipContainer: document.createElement('div'),
      tooltipLine: document.createElement('div'),
      glassPane: document.createElement('div')
    };

    config.container.appendChild(result.wrapper);
    result.wrapper.appendChild(result.animationScreen);
    result.wrapper.appendChild(result.tooltipContainer);
    result.wrapper.appendChild(result.tooltipLine);
    result.wrapper.appendChild(result.glassPane);

    result.wrapper.classList.add(block);
    result.wrapper.classList.add('in-eum-chart');
    result.animationScreen.classList.add(`${block}__animation-screen`);
    result.tooltipContainer.classList.add(`${block}__tooltip-container`);
    result.tooltipLine.classList.add(`${block}__tooltip-line`);
    result.glassPane.classList.add(`${block}__glass-pane`);

    return result;
  }

  function resize() {
    const width = (config.width = dom.wrapper.clientWidth | 0);
    config.bounds = {
      top: config.margins.top,
      bottom: height - config.margins.bottom,
      left: config.margins.left,
      right: width - config.margins.right
    };
    dom.wrapper.style.height = `${height}px`;
    dom.tooltipLine.style.top = `${config.margins.top}px`;
    dom.tooltipLine.style.bottom = `${config.margins.bottom}px`;
    updateCanvasDimensions(dom.animationScreen, ctx.animationScreen, width, height, config.devicePixelRatio);
  }
}
