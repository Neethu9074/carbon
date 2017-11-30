import {
  incident as incidentImage,
  incidentWarningOpen,
  incidentCriticalOpen
} from 'in-components/timeline/icons/icons';

const y = 37;

export default function createIncidentRenderer(basicEventRenderer) {
  return {
    draw
  };

  function draw(incident, isHighlighted) {
    const drawConfig = basicEventRenderer.draw(incident, isHighlighted, y);
    if (drawConfig) {
      const severity = incident.getIn(['problem', 'severity'], 0);
      let imageToDraw = incidentImage;

      if (basicEventRenderer.eventIsOpen(incident)) {
        if (severity > 0) {
          imageToDraw = incidentWarningOpen;
        }
        if (severity > 5) {
          imageToDraw = incidentCriticalOpen;
        }
      }

      basicEventRenderer.drawImage(imageToDraw, drawConfig.triggeringX, y, 16);
    }
  }
}
