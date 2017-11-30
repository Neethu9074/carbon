import { issueWarning, issueCritical, issueWarningOpen, issueCriticalOpen } from 'in-components/timeline/icons/icons';
import { getEventType, EVENT_TYPES } from 'in-stores/events';

const y = 74;

export default function createIssueRenderer(basicEventRenderer) {
  return {
    draw
  };

  function draw(issue, isHighlighted) {
    const drawConfig = basicEventRenderer.draw(issue, isHighlighted, y);
    if (drawConfig) {
      let imageToDraw;

      if (basicEventRenderer.eventIsOpen(issue)) {
        imageToDraw = getImageByIssueType(issue, issueWarningOpen, issueCriticalOpen);
      } else {
        imageToDraw = getImageByIssueType(issue, issueWarning, issueCritical);
      }

      basicEventRenderer.drawImage(imageToDraw, drawConfig.x, y, 14);
    }
  }

  function getImageByIssueType(issue, ifWarning, ifCritical) {
    return getEventType(issue) === EVENT_TYPES.ISSUE_WARNING ? ifWarning : ifCritical;
  }
}
