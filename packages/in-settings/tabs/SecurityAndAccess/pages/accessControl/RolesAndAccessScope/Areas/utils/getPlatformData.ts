/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSet } from '@instana/types';

import {
  LimitableProductArea,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import {
  openstackEnabled,
  pcfEnabled,
  phmcEnabled,
  powervcEnabled,
  vsphereEnabled,
  zhmcEnabled,
  sapEnabled,
  nutanixEnabled
} from 'in-services/featureFlags';
import { getScopeFromProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { t } from 'in-i18n';

// This function can be broken into multiple smaller ones
// Once we rework platform access booleans 'in packages/in-stores/permission.ts'
export const getKubernetesData = (permissionsSet: PermissionSet) => {
  const { kubernetesClusterUUIDs, kubernetesNamespaceUIDs } = permissionsSet;

  /**
   *  Determines what access a group provides
   * @param area to be checked
   * @param featureFlag corresponding featureFlag
   * @returns AccessKind
   */
  const hasAnyAccess = (area: LimitableProductArea, featureFlag: boolean = true): ScopedPermissionType => {
    if (!featureFlag) return ScopedPermissionItem.NO_ACCESS;
    return getScopeFromProductArea(area, permissionsSet);
  };

  const kubernetesAccess = hasAnyAccess(ProductArea.KUBERNETES);
  const vSphereAccess = hasAnyAccess(ProductArea.VSPHERE, vsphereEnabled);
  const phmcAccess = hasAnyAccess(ProductArea.PHMC, phmcEnabled);
  const powervcAccess = hasAnyAccess(ProductArea.POWERVC, powervcEnabled);
  const zhmcAccess = hasAnyAccess(ProductArea.ZHMC, zhmcEnabled);
  const openStackAccess = hasAnyAccess(ProductArea.OPENSTACK, openstackEnabled);
  const pcfAccess = hasAnyAccess(ProductArea.PCF, pcfEnabled);
  const sapAccess = hasAnyAccess(ProductArea.SAP, sapEnabled);
  const nutanixAccess = hasAnyAccess(ProductArea.NUTANIX, nutanixEnabled);

  const countOfKubernetesItemsWithAccess = kubernetesClusterUUIDs.length + kubernetesNamespaceUIDs.length;
  let kubernetesQuantityOfAreas: string;
  switch (kubernetesAccess) {
    case ScopedPermissionItem.ACCESS_ALL:
      kubernetesQuantityOfAreas = t('in-settings:productAreas.role_permission_scope_all');
      break;
    case ScopedPermissionItem.LIMITED_ACCESS:
      kubernetesQuantityOfAreas = String(countOfKubernetesItemsWithAccess);
      break;
    default:
      kubernetesQuantityOfAreas = '0';
      break;
  }

  const translations = [];
  let otherAccessCounter = 0;
  if (pcfAccess !== ScopedPermissionItem.NO_ACCESS) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.PCF }));
  }
  if (phmcAccess !== ScopedPermissionItem.NO_ACCESS) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.PHMC }));
  }
  if (zhmcAccess !== ScopedPermissionItem.NO_ACCESS) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.ZHMC }));
  }
  if (openStackAccess !== ScopedPermissionItem.NO_ACCESS) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.OPENSTACK }));
  }
  if (powervcAccess !== ScopedPermissionItem.NO_ACCESS) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.POWERVC }));
  }
  if (vSphereAccess !== ScopedPermissionItem.NO_ACCESS) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.VSPHERE }));
  }
  if (sapAccess !== ScopedPermissionItem.NO_ACCESS) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.SAP }));
  }
  if (nutanixAccess !== ScopedPermissionItem.NO_ACCESS) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.NUTANIX }));
  }
  if (kubernetesAccess !== ScopedPermissionItem.NO_ACCESS) {
    translations.push(t('in-settings:productAreas.kubernetes'));
  }
  const hasOtherPlatformsAccess = otherAccessCounter !== 0;

  const kubernetesNamespacesWithAccess: string[] = kubernetesNamespaceUIDs
    .filter(it => it.scopeId)
    .map(namespace => namespace.scopeId!!);
  const kubernetesClustersWithAccess: string[] = kubernetesClusterUUIDs
    .filter(it => it.scopeId)
    .map(namespace => namespace.scopeId!!);

  const isDisabled = kubernetesAccess === ScopedPermissionItem.NO_ACCESS && !hasOtherPlatformsAccess;
  const kubernetesColumnHeadline = isDisabled
    ? t('in-settings:productAreas.no_access')
    : t('in-settings:productAreas.role_permissions', {
        context: 'viewer',
        quantityOfAreas: kubernetesQuantityOfAreas
      });

  return {
    countOfKubernetesItemsWithAccess,
    kubernetesAccess,
    pcfAccess,
    vSphereAccess,
    phmcAccess,
    powervcAccess,
    zhmcAccess,
    openStackAccess,
    sapAccess,
    nutanixAccess,
    hasOtherPlatformsAccess,
    kubernetesClustersWithAccess,
    kubernetesColumnHeadline,
    kubernetesNamespacesWithAccess,
    isDisabled,
    translations
  };
};
