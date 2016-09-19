import ChangeEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/ChangeEventRenderer';
import IssueRenderer from 'in-components/timeline/components/renderer/eventRenderer/IssueRenderer';


export default function createEventsRenderer(screenBuffer, scale) {
  const changeEventRenderer = new ChangeEventRenderer(screenBuffer, scale, 14);
  const issueRenderer = new IssueRenderer(screenBuffer, scale, 14);

  function setWidth(width) {
    changeEventRenderer.setWidth(width);
    issueRenderer.setWidth(width);
  }

  function setHighlightedEvent(event) {
    changeEventRenderer.setHighlightedEvent(event);
    issueRenderer.setHighlightedEvent(event);
  }

  function draw() {
  }

  return {
    draw,
    setWidth,
    setHighlightedEvent,
    dispose
  };

  function dispose() {
    changeEventRenderer.dispose();
    issueRenderer.dispose();
  }
}
