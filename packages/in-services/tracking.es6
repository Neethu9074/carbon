import { assign } from 'lodash';

import { noop } from 'in-services/util/function';
import { config } from 'in-services/config';

export const selectedMomentPlacedViaTimeline = buildTransmitter('time.selectedMoment.viaTimeline');
export const selectedMomentPlacedViaTimeSelector = buildTransmitter('time.selectedMoment.viaTimeSelector');

const sharedTransmitterProperties = {
  token: config.mixpanelToken
};

function buildTransmitter(event, defaultProperties = {}) {
  if (!config.mixpanelToken) {
    return noop;
  }
  return props => send(event, assign({}, props, defaultProperties, sharedTransmitterProperties));
}

function send(event, properties) {
  const data = encodeURIComponent(
    btoa(
      JSON.stringify({
        event,
        properties
      })
    )
  );

  const xhr = new XMLHttpRequest();
  xhr.timeout = 60000;
  xhr.open('GET', `https://api.mixpanel.com/track/?data=${data}`);
  xhr.send();
}
