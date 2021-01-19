/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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

  return true;
}
