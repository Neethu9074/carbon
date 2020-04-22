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

function createStringTagFilter(name, operator, stringValue) {
  return Object.freeze({
    name,
    operator,
    stringValue
  });
}
