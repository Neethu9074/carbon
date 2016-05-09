import EventRenderer from 'in-components/timeline/components/renderer/eventRenderer/EventRenderer';
import icons from 'in-components/timeline/icons/icons';


export default class IncidentRenderer extends EventRenderer {

  constructor(buffer, scale, iconSize) {
    super(buffer, scale, 40, iconSize);
  }

  draw(incident, isHighlighted) {
    const x = super.draw(incident, isHighlighted);
    if (!x) {
      return;
    }

    let imageToDraw = icons.incidentImage;
    if (incident.get('state') === 'open') {
      const severity = incident.getIn(['problem', 'severity'], 0);
      if (severity > 0) {
        imageToDraw = icons.incidentWarningImageColored;
      } if (severity > 5) {
        imageToDraw = icons.incidentCriticalImageColored;
      }
    }

    this.drawImage(imageToDraw, x);
  }
}
