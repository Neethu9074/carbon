import * as ro from 'reactive-observables';

import {timeframe$, to$, from$} from 'in-stores/timeline';
import {updateCanvasDimensions} from 'in-charts/canvas';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';
import createScale from 'in-charts/scale';

const changeSignal = true;

export default function createTimelineRenderer({container, canvas}) {
  const backBufferCanvas = document.createElement('canvas');
  const backBuffer = backBufferCanvas.getContext('2d');
  const screenBuffer = canvas.getContext('2d');

  const changes = ro.create();

  const scale = createScale();
  scale.setRangeFrom(0);
  const fromSubscription = from$.subscribe(from => {
    scale.setDomainFrom(from);
    changes.emit(changeSignal);
  });
  const toSubscription = to$.subscribe(to => {
    scale.setDomainTo(to);
    changes.emit(changeSignal);
  });

  let axisConfig;
  const timeframeSubscription = timeframe$
    .map(frame => getAxisConfig(frame.windowSize))
    .distinct()
    .subscribe(config => {
      axisConfig = config;
      changes.emit(changeSignal);
    });

  const height = 162;
  let width;

  const resizeSubscription = ro.on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

  // initial resize
  resize();

  const drawSubscription = changes
  .debounce(300)
  .subscribe(draw);

  return {
    canvas,
    dispose
  };

  function resize() {
    width = container.clientWidth;

    scale.setRangeTo(width);

    updateCanvasDimensions(backBufferCanvas, backBuffer, width, height);
    updateCanvasDimensions(canvas, screenBuffer, width, height);

    changes.emit(changeSignal);
  }

  function draw() {
    drawBackground();
    drawTimeAxis();

    screenBuffer.drawImage(backBufferCanvas, 0, 0);
  }

  function drawBackground() {
    backBuffer.fillStyle = '#2e4048';
    backBuffer.fillRect(0, 0, width, height);
    backBuffer.stroke();

    backBuffer.fillStyle = '#43565e';
    backBuffer.fillRect(0, 40, width, 40);
    backBuffer.fillRect(0, 81, width, 40);
    backBuffer.fillRect(0, 122, width, 40);
    backBuffer.stroke();
  }

  function drawTimeAxis() {
    const tickPositions = getTickPositions(scale, axisConfig);

    backBuffer.beginPath();
    for (let i = 0, length = tickPositions.length; i < length; i++) {
      const position = tickPositions[i];
      const x = Math.ceil(position.range);

      backBuffer.lineWidth = 1;
      backBuffer.strokeStyle = '#43565e';
      backBuffer.moveTo(x, 34);
      backBuffer.lineTo(x, 40);
      backBuffer.stroke();

      backBuffer.fillStyle = '#80939c';
      backBuffer.font = '12px "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
      backBuffer.fillText(axisConfig.formatter(position.domain), x, 28);
    }
    backBuffer.closePath();
  }

  function dispose() {
    timeframeSubscription.dispose();
    resizeSubscription.dispose();
    fromSubscription.dispose();
    drawSubscription.dispose();
    toSubscription.dispose();
  }
}
