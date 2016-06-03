import * as ro from 'reactive-observables';

import BackgroundRenderer from 'in-components/graphView/components/renderer/BackgroundRenderer';
import {updateCanvasDimensions} from 'in-charts/canvas';


export default function createUniverseRenderer({container, canvas}) {
  let height;
  let width;

  const changeSignal = true;
  const changes = ro.create();
  const renderSubscription = changes
    .debounce(300)
    .subscribe(render);

  const backBufferCanvas = document.createElement('canvas');
  const backBuffer = backBufferCanvas.getContext('2d');
  const screenBufferCanvas = canvas;
  const screenBuffer = screenBufferCanvas.getContext('2d');

  const backgroundRenderer = new BackgroundRenderer(backBuffer);

  const resizeSubscription = ro.on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

  // initial resize
  resize();

  return {
    canvas: screenBufferCanvas,
    dispose
  };

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;

    updateCanvasDimensions(screenBufferCanvas, screenBuffer, width, height);
    updateCanvasDimensions(backBufferCanvas, backBuffer, width, height);

    changes.emit(changeSignal);
  }

  function render() {
    backgroundRenderer.draw(width, height);

    // copy backbuffer to screenbuffer
    screenBuffer.drawImage(backBufferCanvas, 0, 0, width, height);
  }

  function dispose() {
    resizeSubscription.dispose();
    renderSubscription.dispose();

    backgroundRenderer.dispose();
  }
}
