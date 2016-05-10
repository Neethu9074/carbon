import * as ro from 'reactive-observables';

import ChangeEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/ChangeEventRenderer';
import HoveredEventLineRenderer from 'in-components/timeline/components/renderer/HoveredEventLineRenderer';
import IncidentRenderer from 'in-components/timeline/components/renderer/eventRenderer/IncidentRenderer';
import MarkedIncidentRenderer from 'in-components/timeline/components/renderer/MarkedIncidentRenderer';
import FocusedMomentRenderer from 'in-components/timeline/components/renderer/FocusedMomentRenderer';
import IssueRenderer from 'in-components/timeline/components/renderer/eventRenderer/IssueRenderer';
import EventsGraphRenderer from 'in-components/timeline/components/renderer/EventsGraphRenderer';
import BackgroundRenderer from 'in-components/timeline/components/renderer/BackgroundRenderer';
import {timeframe$, to$, from$, setTimelineScale} from 'in-components/timeline/timelineStore';
import TimeAxisRenderer from 'in-components/timeline/components/renderer/TimeAxisRenderer';
import RealtimeUpdateEvents from 'in-components/timeline/components/RealtimeUpdateEvents';
import {drawMode$, DRAW_MODES, isCollapsed$} from 'in-components/timeline/timelineStore';
import createMouseEvents from 'in-components/timeline/components/mouseEvents';
import {eventsInTimeframe$, highlightedEvent$} from 'in-stores/events';
import {updateCanvasDimensions} from 'in-charts/canvas';
import {getAxisConfig} from 'in-charts/timeFormatting';
import createScale from 'in-charts/scale';

export default function createTimelineRenderer({container, canvas}) {
  const changeSignal = true;
  const height = 162;
  let width;
  let collapsed;

  const backBufferCanvas = document.createElement('canvas');
  const backBuffer = backBufferCanvas.getContext('2d');
  const screenBufferCanvas = canvas;
  const screenBuffer = screenBufferCanvas.getContext('2d');

  const realtimeDrawStream = ro.create();
  const realtimeUpdateEvents = new RealtimeUpdateEvents(realtimeDrawStream, changeSignal);

  const changes = ro.create();

  const scale = createScale();
  setTimelineScale(scale);
  scale.setRangeFrom(0);
  const fromSubscription = from$.subscribe(from => {
    scale.setDomainFrom(from);
    setTimelineScale(scale);
  });
  const toSubscription = to$.subscribe(to => {
    scale.setDomainTo(to);
    setTimelineScale(scale);
  });
  const collapsedSubscription = isCollapsed$.subscribe(_collapsed => {
    collapsed = _collapsed;

    // only require realtime draw when opening the timeline
    if (collapsed) {
      changes.emit(changeSignal);
    } else {
      realtimeDrawStream.emit(changeSignal);
    }
  });

  const changeEventRenderer = new ChangeEventRenderer(backBuffer, scale, 14);
  const incidentRenderer = new IncidentRenderer(backBuffer, scale, 16);
  const issueRenderer = new IssueRenderer(backBuffer, scale, 14);
  const timeAxisRenderer = new TimeAxisRenderer(backBuffer, scale);
  const backgroundRenderer = new BackgroundRenderer(backBuffer, height);
  const eventsGraphRenderer = new EventsGraphRenderer(backBuffer, height);
  const focusedMomentRenderer = new FocusedMomentRenderer(backBuffer, scale);
  const markedIncidentRenderer = new MarkedIncidentRenderer(backBuffer, scale);
  const hoveredEventLineRenderer = new HoveredEventLineRenderer(backBuffer, scale);

  const highlightedEventIdSubscription = highlightedEvent$.subscribe(event => {
    hoveredEventLineRenderer.setHighlightedEvent(event);
    changeEventRenderer.setHighlightedEvent(event);
    incidentRenderer.setHighlightedEvent(event);
    issueRenderer.setHighlightedEvent(event);

    changes.emit(changeSignal);
  });

  let drawMode;
  drawMode$.subscribe(mode => {
    drawMode = mode;
    realtimeDrawStream.emit(changeSignal);
  });

  const mouseEvents = createMouseEvents(canvas, scale, realtimeDrawStream);

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

  const realtimeDrawSubscription = realtimeDrawStream
    .nextFrame()
    .subscribe(draw);

  return {
    canvas: screenBufferCanvas,
    dispose
  };

  function resize() {
    width = container.clientWidth;

    scale.setRangeTo(width - 20);
    setTimelineScale(scale);

    eventsGraphRenderer.setWidth(width);
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

    if (categorizedEvents) {
      if (drawMode === DRAW_MODES.DISCRETE_EVENTS) {
        markedIncidentRenderer.draw(categorizedEvents.incidents);
        hoveredEventLineRenderer.draw();

        incidentRenderer.drawEvents(categorizedEvents.incidents);

        if (!collapsed) {
          changeEventRenderer.drawEvents(categorizedEvents.changes);
          issueRenderer.drawEvents(categorizedEvents.issues);
        }

      } else if (drawMode === DRAW_MODES.EVENTS_GRAPH) {
        eventsGraphRenderer.draw(categorizedEvents);
      }
    }

    focusedMomentRenderer.draw();

    // copy backbuffer to screenbuffer
    screenBuffer.drawImage(backBufferCanvas, 0, 0, width, height);
  }

  function dispose() {
    mouseEvents.dispose();

    realtimeUpdateEvents.dispose();
    highlightedEventIdSubscription.dispose();
    realtimeDrawSubscription.dispose();
    hoveredEventLineRenderer.dispose();
    markedIncidentRenderer.dispose();
    timeframeSubscription.dispose();
    focusedMomentRenderer.dispose();
    collapsedSubscription.dispose();
    changeEventRenderer.dispose();
    eventsSubscription.dispose();
    resizeSubscription.dispose();
    fromSubscription.dispose();
    incidentRenderer.dispose();
    drawSubscription.dispose();
    toSubscription.dispose();
    issueRenderer.dispose();
  }
}
