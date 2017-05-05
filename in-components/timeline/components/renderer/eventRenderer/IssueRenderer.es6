import { getEventType, EVENT_TYPES } from 'in-stores/events';
import icons from 'in-components/timeline/icons/icons';

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
        imageToDraw = getImageByIssueType(issue, icons.issueWarningImageColored, icons.issueCriticalImageColored);
      } else {
        imageToDraw = getImageByIssueType(issue, icons.issueWarningImage, icons.issueCriticalImage);
      }

      basicEventRenderer.drawImage(imageToDraw, drawConfig.x, y, 14);
    }
  }

  function getImageByIssueType(issue, ifWarning, ifCritical) {
    return getEventType(issue) === EVENT_TYPES.ISSUE_WARNING ? ifWarning : ifCritical;
  }
}
