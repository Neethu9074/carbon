import * as ro from 'reactive-observables';

import ChangeEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/ChangeEventRenderer';
import {eventsInTimeframe$, getNearestEvent, highlightedEvent$, setHighlightedEvent} from 'in-stores/events';
import IncidentRenderer from 'in-components/timeline/components/renderer/eventRenderer/IncidentRenderer';
import IssueRenderer from 'in-components/timeline/components/renderer/eventRenderer/IssueRenderer';
import BackgroundRenderer from 'in-components/timeline/components/renderer/BackgroundRenderer';
import {setTo, setHighlightedEventScreenPosition} from 'in-components/timeline/timelineStore';
import TimeAxisRenderer from 'in-components/timeline/components/renderer/TimeAxisRenderer';
import createMouseEvents from 'in-components/timeline/components/mouseEvents';
import {timeframe$, to$, from$} from 'in-stores/timeline';
import {updateCanvasDimensions} from 'in-charts/canvas';
import {getAxisConfig} from 'in-charts/timeFormatting';
import createScale from 'in-charts/scale';

export default function createTimelineRenderer({container, canvas}) {
  const renderer = {};

  const changeSignal = true;
  const height = 162;
  let width;

  const backBufferCanvas = document.createElement('canvas');
  const backBuffer = backBufferCanvas.getContext('2d');
  const screenBufferCanvas = canvas;
  const screenBuffer = screenBufferCanvas.getContext('2d');

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

  const changeEventRenderer = new ChangeEventRenderer(backBuffer, scale, 14);
  const incidentRenderer = new IncidentRenderer(backBuffer, scale, 16);
  const issueRenderer = new IssueRenderer(backBuffer, scale, 14);
  const timeAxisRenderer = new TimeAxisRenderer(backBuffer, scale);
  const backgroundRenderer = new BackgroundRenderer(backBuffer, height);

  const highlightedEventIdSubscription = highlightedEvent$.subscribe(event => {
    changeEventRenderer.setHighlightedEvent(event);
    incidentRenderer.setHighlightedEvent(event);
    issueRenderer.setHighlightedEvent(event);

    changes.emit(changeSignal);
  });

  const mouseEvents = createMouseEvents(canvas, renderer);

  let axisConfig;
  const timeframeSubscription = timeframe$
    .map(frame => getAxisConfig(frame.windowSize))
    .distinct()
    .subscribe(config => {
      axisConfig = config;
      changes.emit(changeSignal);
    });

  let categorizedEvents;
  const eventsSubscription = eventsInTimeframe$.subscribe(events => {
    categorizedEvents = events;
    changes.emit(changeSignal);
  });

  const resizeSubscription = ro.on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

  // initial resize
  resize();

  const drawSubscription = changes
    .debounce(300)
    .subscribe(draw);

  renderer.canvas = screenBufferCanvas;
  renderer.onMouseLeave = onMouseLeave;
  renderer.onMouseMove = onMouseMove;
  renderer.onMouseDown = onMouseDown;
  renderer.onMouseUp = onMouseUp;
  renderer.dispose = dispose;
  renderer.onDrag = onDrag;

  return renderer;

  function onMouseDown() {}
  function onMouseUp() {}

  function onMouseLeave() {
    setHighlightedEvent(null);
    setHighlightedEventScreenPosition(null);
  }

  function onMouseMove(x, screenX, y) {
    if (!categorizedEvents) {
      return;
    }

    const eventsToCheck = functionGetEventsToCheckByY(y);
    if (!eventsToCheck) {
      return;
    }

    const pixelsToCheckForEventMouseOver = 20;
    const timeAtCursor = scale.getDomain(x);
    const timeFrom = scale.getDomain(x - pixelsToCheckForEventMouseOver / 2);
    const maxDistance = Math.abs(timeAtCursor - timeFrom);

    const hit = getNearestEvent(eventsToCheck, scale.getDomain(x), maxDistance);
    setHighlightedEvent(hit);
    setHighlightedEventScreenPosition(hit ? {x: screenX, y: getTooltipYPosition(y)} : null);
  }

  function functionGetEventsToCheckByY(y) {
    if (y >= 40 && y <= 80) {
      return categorizedEvents.incidents;
    } else if (y >= 81 && y <= 120) {
      return categorizedEvents.issues;
    } else if (y >= 121 && y <= 160) {
      return categorizedEvents.changes;
    }
    return null;
  }

  function getTooltipYPosition(y) {
    if (y >= 40 && y <= 80) {
      return 60;
    } else if (y >= 81 && y <= 120) {
      return 100;
    } else if (y >= 121 && y <= 160) {
      return 120;
    }
    return y;
  }

  function onDrag(x, prevX) {
    const oldTimestamp = scale.getDomain(prevX);
    const newTimestamp = scale.getDomain(x);
    setTo(newTimestamp, oldTimestamp);
  }

  function resize() {
    width = container.clientWidth;

    scale.setRangeTo(width);

    changeEventRenderer.setWidth(width);
    backgroundRenderer.setWidth(width);
    incidentRenderer.setWidth(width);
    issueRenderer.setWidth(width);

    updateCanvasDimensions(screenBufferCanvas, screenBuffer, width, height);
    updateCanvasDimensions(backBufferCanvas, backBuffer, width, height);

    changes.emit(changeSignal);
  }

  function draw() {
    backgroundRenderer.draw();
    timeAxisRenderer.draw(axisConfig);
    drawEvents();

    // copy backbuffer to screenbuffer
    screenBuffer.drawImage(backBufferCanvas, 0, 0, width, height);
  }

  function drawEvents() {
    if (!categorizedEvents) {
      return;
    }

    changeEventRenderer.drawEvents(categorizedEvents.changes);
    incidentRenderer.drawEvents(categorizedEvents.incidents);
    issueRenderer.drawEvents(categorizedEvents.issues);
  }

  function dispose() {
    mouseEvents.dispose();

    highlightedEventIdSubscription.dispose();
    timeframeSubscription.dispose();
    eventsSubscription.dispose();
    resizeSubscription.dispose();
    fromSubscription.dispose();
    drawSubscription.dispose();
    toSubscription.dispose();
  }
}
