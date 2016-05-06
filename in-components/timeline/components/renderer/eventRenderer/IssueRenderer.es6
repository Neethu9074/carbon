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

    let imageToDraw = icons.issueCriticalImage;
    if (issueTracker.getEventType(issue) === issueTracker.EVENT_TYPES.ISSUE_WARNING) {
      if (issue.get('state') === 'open') {
        imageToDraw = icons.issueWarningImageColored;
      } else {
        imageToDraw = icons.issueWarningImage;
      }
    } else if (issue.get('state') === 'open') {
      imageToDraw = icons.issueCriticalImageColored;
    }
    this.drawImage(imageToDraw, x);
  }
}
