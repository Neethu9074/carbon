// event specification type enum names that the back end uses
export const builtInEnumValue = 'BUILT_IN';
export const customEnumValue = 'CUSTOM';

export const builtInValue = 'built-in';
export const customValue = 'custom';

export function isBuiltInRule(entity) {
  return isBuiltInRuleType(entity.type);
}

export function isBuiltInRuleType(type) {
  return type === builtInEnumValue || type == builtInValue;
}

export function isTriggering(entity) {
  if (isBuiltInRule(entity)) {
    return entity.triggering;
  } else if (entity.event) {
    return entity.event.triggering;
  }
  return false;
}

export function getSeverity(entity) {
  if (isBuiltInRule(entity)) {
    return entity.severity;
  } else if (entity.event) {
    return entity.event.severity;
  }
  return 0;
}

export function getDescription(entity) {
  if (isBuiltInRule(entity)) {
    return entity.description;
  } else if (entity.event) {
    return entity.event.description;
  }
  return null;
}
