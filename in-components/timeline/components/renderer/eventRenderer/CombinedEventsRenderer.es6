import createChangeEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/ChangeEventRenderer';
import createBasicEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/BasicEventRenderer';
import createIncidentRenderer from 'in-components/timeline/components/renderer/eventRenderer/IncidentRenderer';
import createIssueRenderer from 'in-components/timeline/components/renderer/eventRenderer/IssueRenderer';
import { isCollapsed$ } from 'in-components/timeline/timelineStore';

export default function createCombinedEventsRenderer(ctx, scale) {
  const basicEventRenderer = createBasicEventRenderer(ctx, scale);
  const changeEventRenderer = createChangeEventRenderer(basicEventRenderer, ctx);
  const incidentRenderer = createIncidentRenderer(basicEventRenderer);
  const issueRenderer = createIssueRenderer(basicEventRenderer);

  let collapsed;
  const collapsedSubscription = isCollapsed$.subscribe(_collapsed => collapsed = _collapsed);

  return {
    setWidth,
    setHighlightedEvent,
    drawEvents,
    dispose
  };

  function setWidth(width) {
    basicEventRenderer.setWidth(width);
  }

  function setHighlightedEvent(event) {
    basicEventRenderer.setHighlightedEvent(event);
  }

  function drawEvents(categorizedEvents) {
    basicEventRenderer.drawEvents(categorizedEvents.incidents, incidentRenderer);

    if (!collapsed) {
      basicEventRenderer.drawEvents(categorizedEvents.changes, changeEventRenderer);
      basicEventRenderer.drawEvents(categorizedEvents.issues, issueRenderer);
    }
  }

  function dispose() {
    collapsedSubscription.dispose();
    basicEventRenderer.dispose();
  }
}
