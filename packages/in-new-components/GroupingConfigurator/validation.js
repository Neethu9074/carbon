import { isBlank, isNotBlank } from 'in-services/util/string';
import { DESTINATION, SOURCE } from '../QueryBuilder/tagFilter/entities';
import { isEmpty } from 'lodash';

export function isValid(groupingConfiguration, tagCatalog) {
  if (isEmpty(groupingConfiguration)) {
    return true;
  }

  const tagTreeNode = tagCatalog.tagsByName[groupingConfiguration.groupbyTag];
  const path = tagTreeNode?.path;

  if (!path) {
    return null;
  }

  const node = path[path.length - 1];

  if (tagTreeNode.canApplyToDestination || tagTreeNode.canApplyToSource) {
    if (
      isBlank(groupingConfiguration.groupbyTagEntity) ||
      (groupingConfiguration.groupbyTagEntity !== DESTINATION && groupingConfiguration.groupbyTagEntity !== SOURCE)
    ) {
      return false;
    }
  } else {
    if (isNotBlank(groupingConfiguration.groupbyTagEntity)) {
      return false;
    }
  }

  if (node.type === 'KEY_VALUE_PAIR') {
    if (!groupingConfiguration.groupbyTagSecondLevelKey || isBlank(groupingConfiguration.groupbyTagSecondLevelKey)) {
      return false;
    }
  }

  return true;
}
