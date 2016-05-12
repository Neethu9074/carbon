import EventRenderer from 'in-components/timeline/components/renderer/eventRenderer/EventRenderer';
import * as issueTracker from 'in-services/issueTracker';
import icons from 'in-components/timeline/icons/icons';


export default class IssueRenderer extends EventRenderer {

  constructor(buffer, scale, iconSize) {
    super(buffer, scale, 81, iconSize);
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
    return issueTracker.getEventType(issue) === issueTracker.EVENT_TYPES.ISSUE_WARNING ?
      ifWarning : ifCritical;
  }
}
