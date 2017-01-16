import BasicEventRenderer from 'in-components/timeline/components/renderer/eventRenderer/BasicEventRenderer';
import icons from 'in-components/timeline/icons/icons';


export default class IncidentRenderer extends BasicEventRenderer {

  constructor(backBuffer, scale, iconSize, yOffset = 37) {
    super(backBuffer, scale, yOffset, iconSize);
  }

  draw(incident, isHighlighted) {
    const x = super.draw(incident, isHighlighted);
    if (!x) {
      return;
    }

    const severity = incident.getIn(['problem', 'severity'], 0);
    let imageToDraw = icons.incidentImage;

    if ((this.eventIsOpen(incident))) {
      if (severity > 0) {
        imageToDraw = icons.incidentWarningImageColored;
      } if (severity > 5) {
        imageToDraw = icons.incidentCriticalImageColored;
      }
    }

    this.drawImage(imageToDraw, x);
  }
}
