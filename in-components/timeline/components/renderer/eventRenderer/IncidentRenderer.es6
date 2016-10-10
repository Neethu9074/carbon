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

    const focusedMoment = this.focusedMoment;
    const severity = incident.get('severity', 0);
    let imageToDraw = icons.incidentImage;

    if ((focusedMoment && this.eventIsOpenAtFocusedMoment(incident)) || this.eventIsOpenOnLiveMode(incident)) {
      if (severity > 0) {
        imageToDraw = icons.incidentWarningImageColored;
      } if (severity > 5) {
        imageToDraw = icons.incidentCriticalImageColored;
      }
    }

    this.drawImage(imageToDraw, x);
  }
}
