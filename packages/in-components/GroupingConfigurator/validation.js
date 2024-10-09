/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';

import { DESTINATION, SOURCE } from '../QueryBuilder/tagFilter/entities';
import { isBlank, isNotBlank } from 'in-services/util/string';

export function isValid(groupingConfiguration, tagCatalog, disableEntitySelection = false) {
  if (isEmpty(groupingConfiguration)) {
    return true;
  }

  const tagTreeNode = tagCatalog.tagsByName[groupingConfiguration.groupbyTag];
  const path = tagTreeNode?.path;

  if (!path) {
    return null;
  }

  if (!disableEntitySelection && (tagTreeNode.canApplyToDestination || tagTreeNode.canApplyToSource)) {
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
