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

    if (issueTracker.getEventType(issue) === issueTracker.EVENT_TYPES.ISSUE_WARNING) {
      if (issue.get('state') === 'open') {
        this.drawImage(icons.issueWarningImageColored, x);
      } else {
        this.drawImage(icons.issueWarningImage, x);
      }
    } else {
      if (issue.get('state') === 'open') {
        this.drawImage(icons.issueCriticalImageColored, x);
      } else {
        this.drawImage(icons.issueCriticalImage, x);
      }
    }
  }
}
