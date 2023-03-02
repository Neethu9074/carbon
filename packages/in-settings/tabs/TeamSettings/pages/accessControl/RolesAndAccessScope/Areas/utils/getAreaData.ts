/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSetWithRoles } from '@instana/types';

import {
  hasApplicationsAccess,
  hasMobileAppsAccess,
  hasWebsitesAccess,
  LimitedAccessScope,
  LimitedAccessScopeType
} from 'in-stores/permission';
import {
  ProductArea,
  ProductAreaType,
  ScopedPermissionItem
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { getAreaRoleFromPermissionSet } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { getScopeFromProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { t } from 'in-i18n';

type ProductAreaWithApplicationData = Extract<ProductAreaType, 'WEBSITE' | 'APPLICATION' | 'MOBILE_APP'>;

type ItemIdKeys = Extract<keyof PermissionSetWithRoles, 'applicationIds' | 'websiteIds' | 'mobileAppIds'>;

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
}

interface getAreaDataProps {
  area: ProductAreaWithApplicationData;
  permissionsSet: PermissionSetWithRoles;
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

  const hasAreaAccess = areaItemData.hasAreaAccess;
  const hasAreaItemsAdded = areaItemIds.length !== 0;
  const areaRole = getAreaRoleFromPermissionSet(ProductArea.WEBSITE, permissionsSet);
  const hasFullAreaAccess = areaAccessScope === ScopedPermissionItem.ACCESS_ALL;

  const areaItemIdsWithAccess = areaItemIds.map(areaItemData => areaItemData.scopeId);

  const shouldRenderContent = Boolean(hasAreaAccess && areaRole && hasAreaItemsAdded);

  const areaColumnHeadline = t('in-settings:productAreas.role_permissions', {
    context: areaRole?.toLowerCase(),
    quantityOfAreas: hasFullAreaAccess ? t('in-settings:general.all') : areaItemIds.length
  });

  return { areaColumnHeadline, hasFullAreaAccess, areaItemIdsWithAccess, shouldRenderContent };
};
