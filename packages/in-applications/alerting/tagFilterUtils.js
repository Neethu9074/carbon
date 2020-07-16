export function getEnrichedTagFilters(alertConfig) {
  const alertType = alertConfig.rule.alertType;
  let tagFilters = alertConfig.tagFilters;
  if (alertType === 'logs') {
    const {
      rule: { operator, message, level }
    } = alertConfig;
    tagFilters = [...tagFilters, ...getLogLevelTagFilters(message, operator, level)];
  } else if (alertType === 'statusCode') {
    const {
      rule: { statusCodeStart, statusCodeEnd }
    } = alertConfig;
    tagFilters = [...tagFilters, ...getStatusCodeTagFilter(statusCodeStart, statusCodeEnd)];
  }

  return [
    ...tagFilters,
    getApplicationIdTagFilter({
      applicationId: alertConfig.applicationId,
      boundaryScope: alertConfig.boundaryScope
    })
  ];
}

export function getApplicationIdTagFilter({ applicationId, boundaryScope }) {
  return createStringTagFilter(
    boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
    'EQUALS',
    applicationId
  );
}

export function getLogLevelTagFilters(message, operator, level) {
  const tagFilters = [];
  tagFilters.push(createStringTagFilter('log.message', operator, message));
  if (level !== 'ANY') {
    tagFilters.push(createStringTagFilter('log.level', 'EQUALS', level));
  }
  return tagFilters;
}

export function getStatusCodeTagFilter(statusCodeStart, statusCodeEnd) {
  const tagFilters = [];
  if (statusCodeStart === statusCodeEnd) {
    tagFilters.push(createNumberTagFilter('call.http.status', 'EQUALS', statusCodeStart));
  } else {
    tagFilters.push(createNumberTagFilter('call.http.status', 'GREATER_OR_EQUAL_THAN', statusCodeStart));
    tagFilters.push(createNumberTagFilter('call.http.status', 'LESS_OR_EQUAL_THAN', statusCodeEnd));
  }
  return tagFilters;
}

function createNumberTagFilter(name, operator, numberValue) {
  return Object.freeze({
    name,
    operator,
    numberValue
  });
}

function createStringTagFilter(name, operator, stringValue) {
  return Object.freeze({
    name,
    operator,
    stringValue
  });
}
