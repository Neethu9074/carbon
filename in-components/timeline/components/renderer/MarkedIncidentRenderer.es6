import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {selectedIncident$} from 'in-stores/events';


const white = '#ffffff';

export default class MarkedIncidentRenderer extends BasicRenderer {

  constructor(backBuffer, scale) {
    super(backBuffer, scale);

    this.selectedIncidentId = null;
    this.selectedIncidentSubscription = selectedIncident$.subscribe(incident =>
      this.selectedIncidentId = incident ? incident.get('id') : null);
  }

  draw(incidents) {
    const selectedIncidentId = this.selectedIncidentId;
    if (!selectedIncidentId) {
      return;
    }

    let match = null;
    for (let i = 0, length = incidents.length; i < length; i++) {
      const incident = incidents[i];
      if (incident.get('id') === selectedIncidentId) {
        match = incident;
        break;
      }
    }

    if (!match) {
      return;
    }

    const x = this.scale.getRange(match.get('start'));
    if (x <= 0 || x > this.width) {
      return;
    }

    const to = match.get('state') === 'open' ?
      this.backBuffer.canvas.width :
      this.scale.getRange(match.get('end'));

    const buffer = this.backBuffer;
    buffer.globalAlpha = 0.2;
    buffer.fillStyle = white;
    buffer.fillRect(x, 74, to - x, 122);
    buffer.globalAlpha = 1;
  }

  dispose() {
    super.dispose();

    this.selectedIncidentSubscription.dispose();
  }
}
