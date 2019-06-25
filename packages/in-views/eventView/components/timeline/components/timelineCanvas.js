import { create } from 'reactive-observables';

import createCombinedEventsRenderer from 'in-views/eventView/components/timeline/components/renderer/eventRenderer/CombinedEventsRenderer';
import createHighlightedTimeframeRenderer from 'in-views/eventView/components/timeline/components/renderer/HighlightedTimeframeRenderer';
import createHighlightedMomentRenderer from 'in-views/eventView/components/timeline/components/renderer/HighlightedMomentRenderer';
import createHoveredEventLineRenderer from 'in-views/eventView/components/timeline/components/renderer/HoveredEventLineRenderer';
import createMarkedIncidentRenderer from 'in-views/eventView/components/timeline/components/renderer/MarkedIncidentRenderer';
import createBackgroundRenderer from 'in-views/eventView/components/timeline/components/renderer/BackgroundRenderer';
import createTimeAxisRenderer from 'in-views/eventView/components/timeline/components/renderer/TimeAxisRenderer';
import createApplyTimeButton from 'in-views/eventView/components/timeline/components/renderer/applyTimeButton';
import createRealtimeUpateEvents from 'in-views/eventView/components/timeline/components/RealtimeUpdateEvents';
import { timeConfig$, to$, from$, setTimelineScale } from 'in-components/timeline/timelineStore';
import createMouseEvents from 'in-views/eventView/components/timeline/components/mouseEvents';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import { getAxisConfig } from 'in-new-components/Axis/timeFormatting';
import { isCollapsed$ } from 'in-components/timeline/timelineStore';
import { eventsInTimeframe$ } from 'in-stores/eventsInTimeframe';
import { updateCanvasDimensions } from 'in-charts/canvas';
import { debouncedResize$ } from 'in-services/browser';
import { highlightedEvent$ } from 'in-stores/events';
import createScale from 'in-services/scale';

export default function createTimelineRenderer({ container, canvas, glassPane }) {
  const changeSignal = true;
  const height = 148;
  let width;
  let collapsed;

  const ctx = canvas.getContext('2d');

  const realtimeDrawStream = create();
  const throttledDrawStream = create();
  const realtimeUpdateEvents = createRealtimeUpateEvents(realtimeDrawStream, changeSignal);

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
      throttledDrawStream.emit(changeSignal);
    } else {
      realtimeDrawStream.emit(changeSignal);
    }
  });

  const timeAxisRenderer = createTimeAxisRenderer(ctx, scale);
  const highlightedMomentRenderer = createHighlightedMomentRenderer(ctx, scale);
  const markedIncidentRenderer = createMarkedIncidentRenderer(ctx, scale);
  const combinedEventsRenderer = createCombinedEventsRenderer(ctx, scale);
  const backgroundRenderer = createBackgroundRenderer(ctx, scale, height);
  const hoveredEventLineRenderer = createHoveredEventLineRenderer(ctx, scale);
  const highlightedTimeframeRenderer = createHighlightedTimeframeRenderer(ctx, scale, height);
  const applyTimeButtonRenderer = createApplyTimeButton(container, glassPane, canvas, scale);

  const highlightedEventIdSubscription = highlightedEvent$.subscribe(event => {
    hoveredEventLineRenderer.setHighlightedEvent(event);
    combinedEventsRenderer.setHighlightedEvent(event);

    throttledDrawStream.emit(changeSignal);
  });

  const highlightedTimeframeSubscription = highlightedTimeframe$.subscribe(() => realtimeDrawStream.emit(changeSignal));

  const mouseEvents = createMouseEvents(glassPane, scale, realtimeDrawStream);

  let axisConfig;
  const timeConfigSubscription = timeConfig$
    .distinct()
    .map(frame => getAxisConfig(frame.windowSize))
    .subscribe(config => {
      axisConfig = config;
      throttledDrawStream.emit(changeSignal);
    });

  let categorizedEvents;
  const eventsSubscription = eventsInTimeframe$.subscribe(events => {
    categorizedEvents = events;
    throttledDrawStream.emit(changeSignal);
  });

  const resizeSubscription = debouncedResize$.subscribe(resize);
  resize(); // initial resize

  const drawSubscription = throttledDrawStream.debounce(300).subscribe(draw);

  const realtimeDrawSubscription = realtimeDrawStream.nextFrame().subscribe(draw);

  return {
    canvas,
    dispose
  };

  function resize() {
    width = container.clientWidth;

    scale.setRangeTo(width - 20);
    setTimelineScale(scale);

    combinedEventsRenderer.setWidth(width);
    backgroundRenderer.setWidth(width);

    updateCanvasDimensions(canvas, ctx, width, height);

    throttledDrawStream.emit(changeSignal);
  }

  function draw() {
    backgroundRenderer.draw();
    timeAxisRenderer.draw(axisConfig);

    if (categorizedEvents) {
      markedIncidentRenderer.draw(categorizedEvents.incidents);
      hoveredEventLineRenderer.draw();
      combinedEventsRenderer.drawEvents(categorizedEvents);
    }

    highlightedTimeframeRenderer.draw();
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
    timeConfigSubscription.dispose();
    collapsedSubscription.dispose();
    eventsSubscription.dispose();
    resizeSubscription.dispose();
    fromSubscription.dispose();
    drawSubscription.dispose();
    toSubscription.dispose();
  }
}
