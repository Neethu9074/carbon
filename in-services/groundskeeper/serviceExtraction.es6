import http from 'in-services/http';

export function getServiceExtractionConfig(type = null) {
  return http({
    method: 'GET',
    url: `/api/serviceExtractionConfigs`
  }).map(response => {
    const rules = response.body.rules;
    if (type == null) {
      return rules;
    }
    return rules.filter(rule => rule.type === type);
  });
}

export function saveServiceExtractionConfig(rules) {
  return http({
    method: 'PUT',
    url: `/api/serviceExtractionConfigs`,
    data: {
      lastModificationTimestamp: Date.now(),
      rules
    }
  }).map(() => true);
}

export function savePartialServiceExtractionConfig(ruleType, rules) {
  return getServiceExtractionConfig().flatMap(existingRules => {
    // merge with rules of other types
    existingRules = existingRules.filter(rule => rule.type !== ruleType);
    existingRules = existingRules.concat(rules);
    return saveServiceExtractionConfig(existingRules);
  });
}
