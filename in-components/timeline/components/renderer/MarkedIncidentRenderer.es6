import { selectedIncident$ } from 'in-stores/events';

const white = '#ffffff';

export default function createMarkedIncidentRenderer(ctx, scale) {
  let selectedIncidentId = null;
  const selectedIncidentSubscription = selectedIncident$.subscribe(
    incident => selectedIncidentId = incident ? incident.get('id') : null
  );

  return {
    draw,
    dispose
  };

  function draw(incidents) {
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

    const x = Math.max(0, scale.getRange(match.get('start')));
    if (x > ctx.canvas.width) {
      return;
    }

    const to = match.get('state') === 'open' ? ctx.canvas.width : scale.getRange(match.get('end'));

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = white;
    ctx.fillRect(x, 74, to - x, 122);
    ctx.globalAlpha = 1;
  }

  function dispose() {
    selectedIncidentSubscription.dispose();
  }
}
