/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSet } from '@instana/types';

import {
  ProductArea,
  ProductAreaType,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { getAreaRoleFromPermissionSet } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { getScopeFromProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { hasSyntheticsAccess, LimitedAccessScope, LimitedAccessScopeType } from 'in-stores/permission';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

type ProductAreaWithSyntheticData = Extract<ProductAreaType, 'SYNTHETICS'>;

type ItemIdKeys = Extract<keyof PermissionSet, 'syntheticTestIds'>;

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
}

interface getAreaDataProps {
  area: ProductAreaWithSyntheticData;
  permissionsSet: PermissionSet;
}

const dataMap: Record<ProductAreaWithSyntheticData, dataMapItem> = {
  [ProductArea.SYNTHETICS]: {
    itemIdKey: 'syntheticTestIds',
    limitedAccessScope: LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE,
    hasAreaAccess: hasSyntheticsAccess
  }
};

const getSubColumnHeadlineText = (quantity: number) => {
  if (syntheticRbacLimitedEnabled) {
    return t('in-settings:productAreas.subHeadline_syntheticMonitoring', {
      quantityOfAreas: quantity
    });
  }
  return quantity;
};

export const getSyntheticAreaData = ({ area, permissionsSet }: getAreaDataProps): AreaData => {
  const areaItemData = dataMap[area];
  const areaItemIds = permissionsSet[areaItemData.itemIdKey] ?? [];

  const areaAccessScope = getScopeFromProductArea(area, permissionsSet);
  const isDisabled = areaAccessScope === ScopedPermissionItem.NO_ACCESS;

  const hasAreaAccess = areaItemData.hasAreaAccess;
  const hasAreaItemsAdded = areaItemIds.length !== 0;
  const areaRole = getAreaRoleFromPermissionSet(area, permissionsSet);
  const hasFullAreaAccess = areaAccessScope === ScopedPermissionItem.ACCESS_ALL;

  const areaItemIdsWithAccess = areaItemIds.map(areaItemData => areaItemData.scopeId);

  const shouldRenderContent = Boolean(hasAreaAccess && areaRole && hasAreaItemsAdded);

  let areaColumnHeadline = '';
  if (areaAccessScope === ScopedPermissionItem.NO_ACCESS) {
    areaColumnHeadline = t('in-settings:productAreas.no_access');
  } else {
    areaColumnHeadline = t('in-settings:productAreas.role_permissions', {
      context: areaRole?.toLowerCase(),
      quantityOfAreas: hasFullAreaAccess ? t('in-settings:general.all') : getSubColumnHeadlineText(areaItemIds.length)
    });
  }

  return { areaColumnHeadline, hasFullAreaAccess, areaItemIdsWithAccess, shouldRenderContent, isDisabled };
};
