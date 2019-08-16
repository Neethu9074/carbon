import { registerTracker } from 'in-services/tracking/trackers';
import { ineum } from 'in-services/eum';

export function init() {
  registerTracker(track);
}

function track(event, meta) {
  ineum('reportEvent', event, { meta });
}
