import * as ro from 'reactive-observables';

import {categorizedEvents$} from 'in-components/timeline/timelineStore';
import {timeframe$, to$, from$} from 'in-stores/timeline';
import {updateCanvasDimensions} from 'in-charts/canvas';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';
import createScale from 'in-charts/scale';

import issueCriticalIcon from 'in-components/timeline/icons/issue_critical.svg';
import issueWarningIcon from 'in-components/timeline/icons/issue_warning.svg';
import incidentIcon from 'in-components/timeline/icons/incident.svg';

const imageSize = 16;

export default function createTimelineRenderer({container, canvas}) {
  const changeSignal = true;
  const darkColor = '#2e4048';
  const midColor = '#43565e';
  const lightColor = '#80939c';
  const font = '12px "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';

  const backBufferCanvas = document.createElement('canvas');
  const backBuffer = backBufferCanvas.getContext('2d');
  const screenBufferCanvas = canvas;
  const screenBuffer = screenBufferCanvas.getContext('2d');

  const changes = ro.create();

  const incidentImage = document.createElement('img');
  incidentImage.onload = () => changes.emit(changeSignal);
  incidentImage.src = incidentIcon;

  const issueWarningImage = document.createElement('img');
  issueWarningImage.onload = () => changes.emit(changeSignal);
  issueWarningImage.src = issueWarningIcon;

  const issueCriticalImage = document.createElement('img');
  issueCriticalImage.onload = () => changes.emit(changeSignal);
  issueCriticalImage.src = issueCriticalIcon;

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

  let categorizedEvents;
  categorizedEvents$.subscribe(events => {
    categorizedEvents = events;
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
    canvas: screenBufferCanvas,
    dispose
  };

  function resize() {
    width = container.clientWidth;

    scale.setRangeTo(width);

    updateCanvasDimensions(backBufferCanvas, backBuffer, width, height);
    updateCanvasDimensions(screenBufferCanvas, screenBuffer, width, height);

    changes.emit(changeSignal);
  }

  function draw() {
    drawBackground();
    drawTimeAxis();
    drawEvents();

    screenBuffer.drawImage(backBufferCanvas, 0, 0, width, height);
  }

  function drawBackground() {
    backBuffer.fillStyle = darkColor;
    backBuffer.fillRect(0, 0, width, height);

    backBuffer.fillStyle = midColor;
    backBuffer.fillRect(0, 40, width, 40);
    backBuffer.fillRect(0, 81, width, 40);
    backBuffer.fillRect(0, 122, width, 40);
  }

  function drawTimeAxis() {
    const tickPositions = getTickPositions(scale, axisConfig);

    for (let i = 0, length = tickPositions.length; i < length; i++) {
      const position = tickPositions[i];
      const x = Math.ceil(position.range);

      // draw line
      backBuffer.fillStyle = midColor;
      backBuffer.fillRect(x, 35, 1, 5);

      // draw time text
      backBuffer.fillStyle = lightColor;
      backBuffer.font = font;
      backBuffer.fillText(axisConfig.formatter(position.domain), x, 28);
    }
  }

  function drawEvents() {
    if (!categorizedEvents) {
      return;
    }

    backBuffer.fillStyle = '#fff';

    // draw incidents
    for (let i = 0, length = categorizedEvents.incidents.length; i < length; i++) {
      drawEvent(categorizedEvents.incidents[i], 41, incidentImage);
    }

    // draw issues
    for (let i = 0, length = categorizedEvents.issues.length; i < length; i++) {
      drawEvent(categorizedEvents.issues[i], 82, issueWarningImage);
    }

    // draw changes
    for (let i = 0, length = categorizedEvents.changes.length; i < length; i++) {
      drawEvent(categorizedEvents.changes[i], 123);
    }
  }

  function drawEvent(event, y, image) {
    const x = scale.getRange(event.get('start'));
    if (x <= 0) {
      return;
    }
    backBuffer.fillRect(x, y, 1, 38);

    if (image) {
      backBuffer.drawImage(
        image, x - imageSize / 2,
        y + 20 - imageSize / 2 - 1,
        imageSize, imageSize);
    }
  }

  function dispose() {
    timeframeSubscription.dispose();
    resizeSubscription.dispose();
    fromSubscription.dispose();
    drawSubscription.dispose();
    toSubscription.dispose();
  }
}
