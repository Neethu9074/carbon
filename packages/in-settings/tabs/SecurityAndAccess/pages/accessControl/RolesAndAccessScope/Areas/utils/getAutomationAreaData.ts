/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  ProductArea,
  ProductAreaType,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { getAreaRoleFromPermissionSet } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { getScopeFromProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { hasAutomationAccess, LimitedAccessScope, LimitedAccessScopeType } from 'in-stores/permission';
import { PermissionSet } from 'in-types';
import { t } from 'in-i18n';

type ProductAreaWithAutomationData = Extract<ProductAreaType, 'AUTOMATION'>;

interface dataMapItem {
  limitedAccessScope: LimitedAccessScopeType;
  hasAreaAccess: boolean;
}

interface AreaData {
  areaColumnHeadline: string;
  hasFullAreaAccess: boolean;
  shouldRenderContent: boolean;
  isDisabled: boolean;
}

interface getAreaDataProps {
  area: ProductAreaWithAutomationData;
  permissionsSet: PermissionSet;
}

const dataMap: Record<ProductAreaWithAutomationData, dataMapItem> = {
  [ProductArea.AUTOMATION]: {
    limitedAccessScope: LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
    hasAreaAccess: hasAutomationAccess
  }
};

export const getAutomationAreaData = ({ area, permissionsSet }: getAreaDataProps): AreaData => {
  const areaItemData = dataMap[area];

  const areaAccessScope = getScopeFromProductArea(area, permissionsSet);
  const isDisabled = areaAccessScope === ScopedPermissionItem.NO_ACCESS;

  const hasAreaAccess = areaItemData.hasAreaAccess;
  const areaRole = getAreaRoleFromPermissionSet(area, permissionsSet);
  const hasFullAreaAccess = areaAccessScope === ScopedPermissionItem.ACCESS_ALL;
  const shouldRenderContent = Boolean(hasAreaAccess && areaRole);

  let areaColumnHeadline = '';
  if (areaAccessScope === ScopedPermissionItem.NO_ACCESS) {
    areaColumnHeadline = t('in-settings:productAreas.no_access');
  } else if (areaAccessScope === ScopedPermissionItem.LIMITED_ACCESS) {
    areaColumnHeadline = t('in-settings:productAreas.role_permissions_limited', {
      context: areaRole?.toLowerCase()
    });
  } else {
    areaColumnHeadline = t('in-settings:productAreas.role_permissions', {
      context: areaRole?.toLowerCase(),
      quantityOfAreas: t('in-settings:general.all')
    });
  }

  return { areaColumnHeadline, hasFullAreaAccess, shouldRenderContent, isDisabled };
};
