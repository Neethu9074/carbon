import icons from 'in-components/timeline/icons/icons';

const y = 37;

export default function createIncidentRenderer(basicEventRenderer) {
  return {
    draw
  };

  function draw(incident, isHighlighted) {
    const drawConfig = basicEventRenderer.draw(incident, isHighlighted, y);
    if (drawConfig) {
      const severity = incident.getIn(['problem', 'severity'], 0);
      let imageToDraw = icons.incidentImage;

      if (basicEventRenderer.eventIsOpen(incident)) {
        if (severity > 0) {
          imageToDraw = icons.incidentWarningImageColored;
        }
        if (severity > 5) {
          imageToDraw = icons.incidentCriticalImageColored;
        }
      }

      basicEventRenderer.drawImage(imageToDraw, drawConfig.triggeringX, y, 16);
    }
  }
}
