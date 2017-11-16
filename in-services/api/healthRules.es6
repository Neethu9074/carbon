import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getHealthRules() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/healthRules`
  }).map(response => fromJS(response.body));
}

export function getHealthRulesByIds(ids) {
  return getHealthRules().map(healthRules => {
    if (!healthRules) {
      return null;
    }

    const healthRulesMap = {};
    healthRules.forEach(healthRule => (healthRulesMap[healthRule.get('id')] = healthRule));

    return ids.map(id => healthRulesMap[id]).filter(resolved => resolved);
  });
}
