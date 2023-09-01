/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSetWithRoles } from '@instana/types';

import {
  analyticsCapabilities,
  eventCapabilities,
  unionGlobalCapabilities
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  ProductArea,
  ProductAreaType,
  ScopedPermissionItem
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { getKubernetesData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getPlatformData';
import { getScopeFromProductArea } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { CapabilityType, hasAnalyzeAccess, hasEventsAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

type CapabilityProductArea = Extract<ProductAreaType, 'ANALYTICS' | 'EVENT' | 'GLOBAL'>;

const capabilitiesDataMap = {
  [ProductArea.ANALYTICS]: {
    productAreaCapabilities: analyticsCapabilities,
    hasProductAreaAccess: hasAnalyzeAccess
  },
  [ProductArea.EVENT]: {
    productAreaCapabilities: eventCapabilities,
    hasProductAreaAccess: hasEventsAccess
  },
  [ProductArea.GLOBAL]: {
    productAreaCapabilities: unionGlobalCapabilities,
    hasProductAreaAccess: true
  }
};

interface getCapabilitiesSectionDataProps {
  area: CapabilityProductArea;
  permissionsSet: PermissionSetWithRoles;
}

export const getCapabilitiesSectionData = ({ area, permissionsSet }: getCapabilitiesSectionDataProps) => {
  const capabilitiesDataMapItem = capabilitiesDataMap[area];
  const productAreaCapabilities = capabilitiesDataMapItem.productAreaCapabilities;
  const disabledColumnHeadline = t('in-settings:productAreas.no_access');
  let isDisabled = false;

  if (area === ProductArea.ANALYTICS || area === ProductArea.EVENT) {
    const groupConfig = getKubernetesData(permissionsSet);

    // If no access for Websites, Mobile Apps, Applications, Platforms, Infrastructure
    // => display "No access"
    if (
      getScopeFromProductArea(ProductArea.APPLICATION, permissionsSet) === ScopedPermissionItem.NO_ACCESS &&
      getScopeFromProductArea(ProductArea.MOBILE_APP, permissionsSet) === ScopedPermissionItem.NO_ACCESS &&
      getScopeFromProductArea(ProductArea.INFRASTRUCTURE, permissionsSet) === ScopedPermissionItem.NO_ACCESS &&
      getScopeFromProductArea(ProductArea.WEBSITE, permissionsSet) === ScopedPermissionItem.NO_ACCESS &&
      groupConfig.kubernetesAccess === ScopedPermissionItem.NO_ACCESS &&
      groupConfig.hasOtherPlatformsAccess === false
    ) {
      isDisabled = true;
    }
  }

  const capabilitiesUserHas = permissionsSet.permissions.filter(permission =>
    productAreaCapabilities.includes(permission as CapabilityType)
  );

  const numberOfcapabilitiesUserHas = capabilitiesUserHas.length;

  const columnHeadline = t('in-settings:productAreas.countOfPermissions', {
    numberOfcapabilitiesUserHas,
    totalNumberOfAreaCapabilities: productAreaCapabilities.length
  });

  const shouldRenderContent = hasAnalyzeAccess && numberOfcapabilitiesUserHas !== 0;

  return {
    columnHeadline: isDisabled ? disabledColumnHeadline : columnHeadline,
    shouldRenderContent,
    isDisabled
  };
};
