import EventRenderer from 'in-components/timeline/components/renderer/eventRenderer/EventRenderer';
import icons from 'in-components/timeline/icons/icons';


export default class IncidentRenderer extends EventRenderer {

  constructor(buffer, scale, iconSize) {
    super(buffer, scale, 40, iconSize);
  }

  draw(event, isHighlighted) {
    const x = super.draw(event, isHighlighted);
    if (!x) {
      return;
    }

    this.drawImage(icons.incidentImage, x);
  }
}
