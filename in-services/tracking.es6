let hubspotQueue = [];

export const events = {
  clickOnServerIn3DMap: '000000370470',
  clickOnServerInSidebar: '000000370626',
  openingADashboard: '000000370614',
  showMetricIn3dMap: '000000370623',
  clickOnConnectionBetweenCubes: '000000370625',
  changingTimeWindowUsingTimeline: '000000370627'
};

export function identify() {
  push('identify', {'email': window.instana.user.email});
}


export function trackEvent(eventId) {
  push('trackEvent', {'id': eventId});
}

function push(event, payload) {
  const msg = [event, payload];

  // the HubSpot API may not be available, queue all tracking messages
  if (window._hsq) {
    window._hsq.push(msg);
  } else if (hubspotQueue) {
    hubspotQueue.push(msg);
  }
}

// the hubspot api should be available after ten seconds. If it is not, we
// assume that will never be available and remove the queue to avoid memory
// leaks.
setTimeout(() => {
  if (window._hsq) {
    hubspotQueue.forEach(msg => window._hsq.push(msg));
  }
  hubspotQueue = null;
}, 1000 * 10);
