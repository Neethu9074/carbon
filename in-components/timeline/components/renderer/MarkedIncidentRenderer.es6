import {selectedIncidentId$} from 'in-stores/incident';


const white = '#ffffff';

export default class MarkedIncidentRenderer {

  constructor(buffer, scale) {
    this.selectedIncidentId = null;
    this.buffer = buffer;
    this.scale = scale;

    this.selectedIncidentSubscription = selectedIncidentId$.subscribe(si => this.selectedIncidentId = si);
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
      this.scale.getRange(this.scale.getDomainTo()) :
      this.scale.getRange(match.get('end'));

    this.buffer.globalAlpha = 0.2;
    this.buffer.fillStyle = white;
    this.buffer.fillRect(x, 40, to - x, 122);
    this.buffer.globalAlpha = 1;
  }

  dispose() {
    this.selectedIncidentSubscription.dispose();
  }
}
