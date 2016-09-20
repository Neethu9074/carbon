import {on, create} from 'reactive-observables';

import HighlightedMomentRenderer from 'in-components/timeline/components/renderer/HighlightedMomentRenderer';
import HoveredEventLineRenderer from 'in-components/timeline/components/renderer/HoveredEventLineRenderer';
import createEventsRenderer from 'in-components/eventView/components/eventDetails/renderer/EventsRenderer';
import createMouseEvents from 'in-components/eventView/components/eventDetails/renderer/mouseEvents';
import BackgroundRenderer from 'in-components/timeline/components/renderer/BackgroundRenderer';
import TimeAxisRenderer from 'in-components/timeline/components/renderer/TimeAxisRenderer';
import RealtimeUpdateEvents from 'in-components/timeline/components/RealtimeUpdateEvents';
import {updateCanvasDimensions} from 'in-charts/canvas';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {highlightedEvent$} from 'in-stores/events';
import {getEvent} from 'in-services/issueTracker';
import {serverTime$} from 'in-stores/serverTime';
import createScale from 'in-charts/scale';


export default function createTimelineRenderer({container, canvas}) {
  const changeSignal = true;
  const height = 112;
  const timeOffset = 1000 * 10;
  let width;

  const screenBufferCanvas = canvas;
  const screenBuffer = screenBufferCanvas.getContext('2d');

  const realtimeDrawStream = create();
  const realtimeUpdateEvents = new RealtimeUpdateEvents(realtimeDrawStream, changeSignal);

  const changes = create();

  const scale = createScale();
  scale.setRangeFrom(10);
  scale.setDomainFrom(Date.now() - 1000 * 60 * 60);
  scale.setDomainTo(Date.now());

  let axisConfig = getAxisConfig(1000 * 60 * 60);

  realtimeDrawStream.emit(changeSignal);

  const timeAxisRenderer = new TimeAxisRenderer(screenBuffer, scale);
  const eventsRenderer = createEventsRenderer(screenBuffer, scale);
  const highlightedMomentRenderer = new HighlightedMomentRenderer(screenBuffer, scale);
  const backgroundRenderer = new BackgroundRenderer(screenBuffer, scale, height);
  const hoveredEventLineRenderer = new HoveredEventLineRenderer(screenBuffer, scale);

  let servertimeSubscription;
  let incidentSubscription;

  const highlightedEventIdSubscription = highlightedEvent$.subscribe(event => {
    hoveredEventLineRenderer.setHighlightedEvent(event);
    eventsRenderer.setHighlightedEvent(event);
    changes.emit(changeSignal);
  });

  const mouseEvents = createMouseEvents(canvas, scale, realtimeDrawStream);

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
    setIncidentId,
    dispose
  };

  function setIncidentId(id) {
    if (!id) {
      return;
    }
    setupIncidentSubscription(id);
  }

  function setupIncidentSubscription(incidentId) {
    disposeIncidentSubscription();
    incidentSubscription = getEvent(incidentId).subscribe(event => {
      if (event) {
        const start = event.get('start') - timeOffset;
        scale.setDomainFrom(start);

        const end = event.get('end');
        if (end) {
          disposeServertimeSubscription();
          setScaleTo(end);
        } else {
          setupServertimeSubscription();
        }
      }
    });
  }

  function disposeIncidentSubscription() {
    if (incidentSubscription) {
      incidentSubscription.dispose();
      incidentSubscription = null;
    }
  }

  function setupServertimeSubscription() {
    disposeServertimeSubscription();
    servertimeSubscription = serverTime$.subscribe(time => setScaleTo(time));
  }

  function disposeServertimeSubscription() {
    if (servertimeSubscription) {
      servertimeSubscription.dispose();
      servertimeSubscription = null;
    }
  }

  function setScaleTo(to) {
    scale.setDomainTo(to + timeOffset);
    axisConfig = getAxisConfig(scale.getDomainTo() - scale.getDomainFrom());
    realtimeDrawStream.emit(changeSignal);
  }

  function resize() {
    width = container.clientWidth;
    scale.setRangeTo(width);
    backgroundRenderer.setWidth(width);
    eventsRenderer.setWidth(width);
    updateCanvasDimensions(screenBufferCanvas, screenBuffer, width, height);

    changes.emit(changeSignal);
  }

  function draw() {
    backgroundRenderer.draw();
    timeAxisRenderer.draw(axisConfig);
    eventsRenderer.draw();
    highlightedMomentRenderer.draw();
  }

  function dispose() {
    mouseEvents.dispose();

    disposeIncidentSubscription();
    disposeServertimeSubscription();
    realtimeUpdateEvents.dispose();
    highlightedEventIdSubscription.dispose();
    highlightedMomentRenderer.dispose();
    realtimeDrawSubscription.dispose();
    hoveredEventLineRenderer.dispose();
    resizeSubscription.dispose();
    drawSubscription.dispose();
    eventsRenderer.dispose();
  }
}
