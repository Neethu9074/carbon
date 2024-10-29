/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSet } from '@instana/types';

import {
  ProductArea,
  ProductAreaType,
  ScopedPermissionItem,
  ScopeRoles
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import {
  Capability,
  hasApplicationsAccess,
  hasMobileAppsAccess,
  hasWebsitesAccess,
  LimitedAccessScope,
  LimitedAccessScopeType
} from 'in-stores/permission';
import { getAreaRoleFromPermissionSet } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { getScopeFromProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { t } from 'in-i18n';

type ProductAreaWithApplicationData = Extract<ProductAreaType, 'WEBSITE' | 'APPLICATION' | 'MOBILE_APP'>;

type ItemIdKeys = Extract<keyof PermissionSet, 'applicationIds' | 'websiteIds' | 'mobileAppIds'>;

interface dataMapItem {
  itemIdKey: ItemIdKeys;
  limitedAccessScope: LimitedAccessScopeType;
  hasAreaAccess: boolean;
}

interface AreaData {
  areaItemIdsWithAccess: (string | undefined)[];
  areaColumnHeadline: string;
  hasFullAreaAccess: boolean;
  shouldRenderContent: boolean;
  isDisabled: boolean;
  contributorAccessItemIds?: (string | undefined)[];
  contributorAccessHeadline?: string;
  areaAccessHeadline?: string;
}

interface getAreaDataProps {
  area: ProductAreaWithApplicationData;
  permissionsSet: PermissionSet;
}

const dataMap: Record<ProductAreaWithApplicationData, dataMapItem> = {
  [ProductArea.WEBSITE]: {
    itemIdKey: 'websiteIds',
    limitedAccessScope: LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
    hasAreaAccess: hasWebsitesAccess
  },
  [ProductArea.APPLICATION]: {
    itemIdKey: 'applicationIds',
    limitedAccessScope: LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
    hasAreaAccess: hasApplicationsAccess
  },
  [ProductArea.MOBILE_APP]: {
    itemIdKey: 'mobileAppIds',
    limitedAccessScope: LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
    hasAreaAccess: hasMobileAppsAccess
  }
};

export const getAreaData = ({ area, permissionsSet }: getAreaDataProps): AreaData => {
  const areaItemData = dataMap[area];
  const areaItemIds = permissionsSet[areaItemData.itemIdKey] ?? [];

  const areaAccessScope = getScopeFromProductArea(area, permissionsSet);
  const isDisabled = areaAccessScope === ScopedPermissionItem.NO_ACCESS;

  const hasAreaAccess = areaItemData.hasAreaAccess;
  const hasAreaItemsAdded = areaItemIds.length !== 0;
  const areaRole = getAreaRoleFromPermissionSet(area, permissionsSet);

  const hasFullAreaAccess = areaAccessScope === ScopedPermissionItem.ACCESS_ALL;
  const isApplicationSectionWithContributor =
    area === ProductArea.APPLICATION && permissionsSet.restrictedApplicationFilter;
  const areaItemIdsWithAccess = isApplicationSectionWithContributor
    ? areaItemIds.filter(areaItem => areaItem.scopeRoleId !== ScopeRoles.Contributor).map(areaItem => areaItem.scopeId)
    : areaItemIds.map(areaItemData => areaItemData.scopeId);

  const shouldRenderContent = Boolean(hasAreaAccess && areaRole && hasAreaItemsAdded);
  const contributorAccessItemIds = areaItemIds
    .filter(areaItem => areaItem.scopeRoleId === ScopeRoles.Contributor)
    .map(areaItem => areaItem.scopeId);
  const hasItemsWithOwnerAccess = permissionsSet.permissions.includes(Capability.CAN_CONFIGURE_APPLICATIONS);
  let areaColumnHeadline = '';
  let contributorAccessHeadline = '';
  let areaAccessHeadline = '';

  if (isApplicationSectionWithContributor) {
    areaAccessHeadline = hasItemsWithOwnerAccess
      ? t('in-settings:permissionScope.selection_owner_access')
      : t('in-settings:permissionScope.selection_viewer_access');
    contributorAccessHeadline = t('in-settings:permissionScope.selection_contributor_access');
    let quantityOfAreas = hasFullAreaAccess ? t('in-settings:general.all') : areaItemIdsWithAccess?.length;

    if (hasItemsWithOwnerAccess) {
      areaColumnHeadline = t('in-settings:productAreas.role_permissions_contributor_and_owner', {
        quantityOfAreas: quantityOfAreas,
        quantityOfAreasContributor: contributorAccessItemIds?.length
      });
    } else {
      areaColumnHeadline = t('in-settings:productAreas.role_permissions_contributor_and_viewer', {
        quantityOfAreas: quantityOfAreas,
        quantityOfAreasContributor: contributorAccessItemIds?.length
      });
    }
  } else {
    if (areaAccessScope === ScopedPermissionItem.NO_ACCESS) {
      areaColumnHeadline = t('in-settings:productAreas.no_access');
    } else {
      areaColumnHeadline = t('in-settings:productAreas.role_permissions', {
        context: areaRole?.toLowerCase(),
        quantityOfAreas: hasFullAreaAccess ? t('in-settings:general.all') : areaItemIds.length
      });
    }
  }

  return {
    areaColumnHeadline,
    hasFullAreaAccess,
    areaItemIdsWithAccess,
    shouldRenderContent,
    isDisabled,
    contributorAccessItemIds,
    contributorAccessHeadline,
    areaAccessHeadline
  };
};
