import ChangeEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/ChangeEventRenderer';
import IncidentRenderer from 'in-components/timeline/components/renderer/eventRenderer/IncidentRenderer';
import IssueRenderer from 'in-components/timeline/components/renderer/eventRenderer/IssueRenderer';
import { isCollapsed$ } from 'in-components/timeline/timelineStore';

export default class CombinedEventsRenderer {
  constructor(backBuffer, scale) {
    this.changeEventRenderer = new ChangeEventRenderer(backBuffer, scale, 14);
    this.incidentRenderer = new IncidentRenderer(backBuffer, scale, 16);
    this.issueRenderer = new IssueRenderer(backBuffer, scale, 14);

    this.collapsed;
    this.collapsedSubscription = isCollapsed$.subscribe(_collapsed => this.collapsed = _collapsed);
  }

  setWidth(width) {
    this.changeEventRenderer.setWidth(width);
    this.incidentRenderer.setWidth(width);
    this.issueRenderer.setWidth(width);
  }

  setHighlightedEvent(event) {
    this.changeEventRenderer.setHighlightedEvent(event);
    this.incidentRenderer.setHighlightedEvent(event);
    this.issueRenderer.setHighlightedEvent(event);
  }

  drawEvents(categorizedEvents) {
    this.incidentRenderer.drawEvents(categorizedEvents.incidents);

    if (!this.collapsed) {
      this.changeEventRenderer.drawEvents(categorizedEvents.changes);
      this.issueRenderer.drawEvents(categorizedEvents.issues);
    }
  }

  dispose() {
    this.collapsedSubscription.dispose();
    this.changeEventRenderer.dispose();
    this.incidentRenderer.dispose();
    this.issueRenderer.dispose();
  }
}
