import {on, create} from 'reactive-observables';

import CombinedEventsRenderer from 'in-components/timeline/components/renderer/eventRenderer/CombinedEventsRenderer';
import HighlightedTimeframeRenderer from 'in-components/timeline/components/renderer/HighlightedTimeframeRenderer';
import HighlightedMomentRenderer from 'in-components/timeline/components/renderer/HighlightedMomentRenderer';
import HoveredEventLineRenderer from 'in-components/timeline/components/renderer/HoveredEventLineRenderer';
import MarkedIncidentRenderer from 'in-components/timeline/components/renderer/MarkedIncidentRenderer';
import FocusedMomentRenderer from 'in-components/timeline/components/renderer/FocusedMomentRenderer';
import EventsGraphRenderer from 'in-components/timeline/components/renderer/EventsGraphRenderer';
import BackgroundRenderer from 'in-components/timeline/components/renderer/BackgroundRenderer';
import createApplyTimeButton from 'in-components/timeline/components/renderer/applyTimeButton';
import {timeframe$, to$, from$, setTimelineScale} from 'in-components/timeline/timelineStore';
import TimeAxisRenderer from 'in-components/timeline/components/renderer/TimeAxisRenderer';
import RealtimeUpdateEvents from 'in-components/timeline/components/RealtimeUpdateEvents';
import {drawMode$, DRAW_MODES, isCollapsed$} from 'in-components/timeline/timelineStore';
import {highlightedTimeframe$} from 'in-stores/timeline/highlightedTimeframe';
import createMouseEvents from 'in-components/timeline/components/mouseEvents';
import {eventsInTimeframe$, highlightedEvent$} from 'in-stores/events';
import {updateCanvasDimensions} from 'in-charts/canvas';
import {getAxisConfig} from 'in-charts/timeFormatting';
import createScale from 'in-charts/scale';


export default function createTimelineRenderer({container, canvas, glassPane}) {
  const changeSignal = true;
  const height = 148;
  let width;
  let collapsed;

  const screenBufferCanvas = canvas;
  const screenBuffer = screenBufferCanvas.getContext('2d');

  const realtimeDrawStream = create();
  const realtimeUpdateEvents = new RealtimeUpdateEvents(realtimeDrawStream, changeSignal);

  const changes = create();

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

  const timeAxisRenderer = new TimeAxisRenderer(screenBuffer, scale);
  const focusedMomentRenderer = new FocusedMomentRenderer(screenBuffer, scale);
  const highlightedMomentRenderer = new HighlightedMomentRenderer(screenBuffer, scale);
  const markedIncidentRenderer = new MarkedIncidentRenderer(screenBuffer, scale);
  const combinedEventsRenderer = new CombinedEventsRenderer(screenBuffer, scale);
  const backgroundRenderer = new BackgroundRenderer(screenBuffer, scale, height);
  const eventsGraphRenderer = new EventsGraphRenderer(screenBuffer, scale, height);
  const hoveredEventLineRenderer = new HoveredEventLineRenderer(screenBuffer, scale);
  const highlightedTimeframeRenderer = new HighlightedTimeframeRenderer(screenBuffer, scale, height);
  const applyTimeButtonRenderer = createApplyTimeButton(container, canvas, scale);

  const highlightedEventIdSubscription = highlightedEvent$.subscribe(event => {
    hoveredEventLineRenderer.setHighlightedEvent(event);
    combinedEventsRenderer.setHighlightedEvent(event);

    changes.emit(changeSignal);
  });

  let drawMode;
  drawMode$.subscribe(mode => {
    drawMode = mode;
    realtimeDrawStream.emit(changeSignal);
  });

  const highlightedTimeframeSubscription = highlightedTimeframe$.subscribe(() => realtimeDrawStream.emit(changeSignal));

  const mouseEvents = createMouseEvents(glassPane, scale, realtimeDrawStream);

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

  const resizeSubscription = on(window, 'resize')
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
    combinedEventsRenderer.setWidth(width);
    backgroundRenderer.setWidth(width);

    updateCanvasDimensions(screenBufferCanvas, screenBuffer, width, height);

    changes.emit(changeSignal);
  }

  function draw() {
    backgroundRenderer.draw();
    timeAxisRenderer.draw(axisConfig);

    if (categorizedEvents) {
      if (drawMode === DRAW_MODES.DISCRETE_EVENTS) {
        markedIncidentRenderer.draw(categorizedEvents.incidents);
        hoveredEventLineRenderer.draw();
        combinedEventsRenderer.drawEvents(categorizedEvents);

      } else if (drawMode === DRAW_MODES.EVENTS_GRAPH) {
        eventsGraphRenderer.draw(categorizedEvents);
      }
    }

    highlightedTimeframeRenderer.draw();
    focusedMomentRenderer.draw();
    highlightedMomentRenderer.draw();

    applyTimeButtonRenderer.update();
  }

  function dispose() {
    mouseEvents.dispose();

    realtimeUpdateEvents.dispose();
    highlightedTimeframeSubscription.dispose();
    highlightedEventIdSubscription.dispose();
    highlightedTimeframeRenderer.dispose();
    highlightedMomentRenderer.dispose();
    realtimeDrawSubscription.dispose();
    hoveredEventLineRenderer.dispose();
    applyTimeButtonRenderer.dispose();
    markedIncidentRenderer.dispose();
    combinedEventsRenderer.dispose();
    timeframeSubscription.dispose();
    focusedMomentRenderer.dispose();
    collapsedSubscription.dispose();
    eventsSubscription.dispose();
    resizeSubscription.dispose();
    fromSubscription.dispose();
    drawSubscription.dispose();
    toSubscription.dispose();
  }
}
