import { fromJS } from 'immutable';

import { configuredForecasts } from 'in-services/forecastConfig';
import { always } from 'in-services/fixedStreams';

export function getForecastRules() {
  // return http({
  //   method: 'GET',
  //   maxRetries: 0,
  //   url: `/api/forecasts`
  // }).map(response => fromJS(configuredForecasts));
  return always(fromJS(configuredForecasts));
}

export function deleteForecastRule() {}
