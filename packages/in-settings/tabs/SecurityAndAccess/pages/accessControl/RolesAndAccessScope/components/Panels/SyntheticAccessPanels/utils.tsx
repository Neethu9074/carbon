/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ScopedPermissionItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';

export const enum Access {
  ACCESS_MATCH,
  ACCESS_NO_MATCH,
  NO_ACCESS
}

/**
 * Retrieves the association IDs from the parsed supplementary data based on the context.
 * @param context The context for which to retrieve the association IDs.
 * @param parsedSupplementary The parsed supplementary data object.
 * @returns An array of association IDs.
 */
const getAssociationIds = (context: string, parsedSupplementary: any): Array<string> => {
  if (context === 'application') return parsedSupplementary?.applications;
  if (context === 'websites') return parsedSupplementary?.websites;
  if (context === 'mobileApps') return parsedSupplementary?.mobileApps;
  return [];
};

export const hasAccess = (
  context: string,
  accessScope: string,
  limitedScopeAssociationIds: Array<string>,
  parsedSupplementary: any
) => {
  const associationIds = getAssociationIds(context, parsedSupplementary);

  const noAssociationsInherited = associationIds == null || associationIds.length == 0;

  if (accessScope === ScopedPermissionItem.ACCESS_ALL) {
    return noAssociationsInherited ? Access.ACCESS_NO_MATCH : Access.ACCESS_MATCH;
  }

  if (accessScope === ScopedPermissionItem.LIMITED_ACCESS) {
    if (noAssociationsInherited) {
      return Access.ACCESS_NO_MATCH;
    }

    const areAllIdsIncluded = associationIds.every(associationId => {
      return limitedScopeAssociationIds.includes(associationId);
    });

    return areAllIdsIncluded ? Access.ACCESS_MATCH : Access.NO_ACCESS;
  }

  if (accessScope === ScopedPermissionItem.NO_ACCESS) {
    return noAssociationsInherited ? Access.ACCESS_NO_MATCH : Access.NO_ACCESS;
  }

  // No access scope found, test should not be listed here.
  return Access.NO_ACCESS;
};
