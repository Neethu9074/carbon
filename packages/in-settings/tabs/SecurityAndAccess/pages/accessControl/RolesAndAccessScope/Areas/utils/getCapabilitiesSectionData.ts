/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSet } from '@instana/types';

import {
  ProductArea,
  ProductAreaType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { unionGlobalCapabilities } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { CapabilityType, hasAnalyzeAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

type CapabilityProductArea = Extract<ProductAreaType, 'GLOBAL'>;

const capabilitiesDataMap = {
  [ProductArea.GLOBAL]: {
    productAreaCapabilities: unionGlobalCapabilities,
    hasProductAreaAccess: true
  }
};

interface getCapabilitiesSectionDataProps {
  area: CapabilityProductArea;
  permissionsSet: PermissionSet;
}

export const getCapabilitiesSectionData = ({ area, permissionsSet }: getCapabilitiesSectionDataProps) => {
  const capabilitiesDataMapItem = capabilitiesDataMap[area];
  const productAreaCapabilities = capabilitiesDataMapItem.productAreaCapabilities;
  const disabledColumnHeadline = t('in-settings:productAreas.no_access');
  let isDisabled = false;

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
