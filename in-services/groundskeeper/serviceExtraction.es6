import config from 'in-services/config';
import http from 'in-services/http';

export function getServiceExtractionConfig(type = null) {
  return http({
    method: 'GET',
    url: `/ump/${config.tenant}/${config.tenantUnit}/serviceExtractionConfig`
  })
  .map(response => {
    const rules = response.body.rules;
    if (type == null) {
      return rules;
    }
    return rules.filter(rule => rule.type === type);
  });
}


export function saveServiceExtractionConfig(rules) {
  return http({
    method: 'POST',
    url: `/ump/${config.tenant}/${config.tenantUnit}/serviceExtractionConfig`,
    data: {
      lastModificationTimestamp: Date.now(),
      rules
    }
  })
  .map(() => true);
}
