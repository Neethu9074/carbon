/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSetWithRoles } from '@instana/types';

import {
  analyticsCapabilities,
  eventCapabilities,
  mixedCapabilities
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  ProductArea,
  ProductAreaType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { CapabilityType, hasAnalyzeAccess, hasEventsAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

type CapabilityProductArea = Extract<ProductAreaType, 'ANALYTICS' | 'EVENT' | 'MIXED'>;

const capabilitiesDataMap = {
  [ProductArea.ANALYTICS]: {
    productAreaCapabilities: analyticsCapabilities,
    hasProductAreaAccess: hasAnalyzeAccess
  },
  [ProductArea.EVENT]: {
    productAreaCapabilities: eventCapabilities,
    hasProductAreaAccess: hasEventsAccess
  },
  [ProductArea.MIXED]: {
    productAreaCapabilities: mixedCapabilities,
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
    columnHeadline,
    shouldRenderContent
  };
};
