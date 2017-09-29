import { fromJS } from 'immutable';

import { configuredForecasts } from 'in-services/forecastConfig';
import { always } from 'in-services/fixedStreams';

export function getDynamicRules() {
  return always(fromJS(configuredForecasts));
}

export function deleteDynamicRule() {}
