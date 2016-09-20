import BasicEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/BasicEventRenderer';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import icons from 'in-components/timeline/icons/icons';


export default class IssueRenderer extends BasicEventRenderer {

  constructor(backBuffer, scale, iconSize, yOffset = 74) {
    super(backBuffer, scale, yOffset, iconSize);
  }

  draw(issue, isHighlighted) {
    const x = super.draw(issue, isHighlighted);
    if (!x) {
      return;
    }

    const focusedMoment = this.focusedMoment;
    let imageToDraw = icons.issueCriticalImage;

    if (focusedMoment) {
      if (this.eventIsOpenAtFocusedMoment(issue)) {
        imageToDraw = this.getImageByIssueType(issue, icons.issueWarningImageColored, icons.issueCriticalImageColored);
      } else {
        imageToDraw = this.getImageByIssueType(issue, icons.issueWarningImage, icons.issueCriticalImage);
      }
    } else {
      if (this.eventIsOpenOnLiveMode(issue)) {
        imageToDraw = this.getImageByIssueType(issue, icons.issueWarningImageColored, icons.issueCriticalImageColored);
      } else {
        imageToDraw = this.getImageByIssueType(issue, icons.issueWarningImage, icons.issueCriticalImage);
      }
    }

    this.drawImage(imageToDraw, x);
  }

  getImageByIssueType(issue, ifWarning, ifCritical) {
    return getEventType(issue) === EVENT_TYPES.ISSUE_WARNING ?
      ifWarning : ifCritical;
  }
}
