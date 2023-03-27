/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSetWithRoles } from '@instana/types';

import {
  ProductArea,
  ProductAreaPermissionMap,
  ProductAreaType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  openstackEnabled,
  pcfEnabled,
  phmcEnabled,
  vsphereEnabled,
  zhmcEnabled,
  sapEnabled
} from 'in-services/featureFlags';
import { t } from 'in-i18n';

/**
 * Kind of access a group can provide to an area
 */
export enum AccessKind {
  All,
  Limited,
  None
}

// This function can be broken into multiple smaller ones
// Once we rework platform access booleans 'in packages/in-stores/permission.ts'
export const getKubernetesData = (permissionsSet: PermissionSetWithRoles) => {
  const { kubernetesClusterUUIDs, kubernetesNamespaceUIDs, permissions } = permissionsSet;

  /**
   *  Determines what access a group provides
   * @param area to be checked
   * @param featureFlag corresponding featureFlag
   * @returns AccessKind
   */
  const hasAnyAccess = (area: ProductAreaType, featureFlag: boolean = true): AccessKind => {
    if (!featureFlag) return AccessKind.None;
    const { limitation, permission } = ProductAreaPermissionMap[area];
    if (!limitation || !permissions.includes(limitation)) return AccessKind.All;
    if (permission && permissions.includes(permission)) return AccessKind.Limited;
    return AccessKind.None;
  };

  const kubernetesAccess = hasAnyAccess(ProductArea.KUBERNETES);
  const vSphereAccess = hasAnyAccess(ProductArea.VSPHERE, vsphereEnabled);
  const phmcAccess = hasAnyAccess(ProductArea.PHMC, phmcEnabled);
  const zhmcAccess = hasAnyAccess(ProductArea.ZHMC, zhmcEnabled);
  const openStackAccess = hasAnyAccess(ProductArea.OPENSTACK, openstackEnabled);
  const pcfAccess = hasAnyAccess(ProductArea.PCF, pcfEnabled);
  const sapAccess = hasAnyAccess(ProductArea.SAP, sapEnabled);

  const countOfKubernetesItemsWithAccess = kubernetesClusterUUIDs.length + kubernetesNamespaceUIDs.length;
  let kubernetesQuantityOfAreas: string;
  switch (kubernetesAccess) {
    case AccessKind.All:
      kubernetesQuantityOfAreas = t('in-settings:productAreas.role_permission_scope_all');
      break;
    default:
      kubernetesQuantityOfAreas = String(countOfKubernetesItemsWithAccess);
  }

  const translations = [];
  let otherAccessCounter = 0;
  if (pcfAccess !== AccessKind.None) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.PCF }));
  }
  if (phmcAccess !== AccessKind.None) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.PHMC }));
  }
  if (zhmcAccess !== AccessKind.None) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.ZHMC }));
  }
  if (openStackAccess !== AccessKind.None) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.VSPHERE }));
  }
  if (vSphereAccess !== AccessKind.None) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.VSPHERE }));
  }
  if (sapAccess !== AccessKind.None) {
    otherAccessCounter++;
    translations.push(t('in-settings:productAreas.permissions', { context: ProductArea.SAP }));
  }
  if (kubernetesAccess !== AccessKind.None) {
    translations.push(t('in-settings:productAreas.kubernetes'));
  }
  const hasOtherPlatformsAccess = otherAccessCounter !== 0;

  const kubernetesNamespacesWithAccess: string[] = kubernetesNamespaceUIDs
    .filter(it => it.scopeId)
    .map(namespace => namespace.scopeId!!);
  const kubernetesClustersWithAccess: string[] = kubernetesClusterUUIDs
    .filter(it => it.scopeId)
    .map(namespace => namespace.scopeId!!);

  const kubernetesColumnHeadline = t('in-settings:productAreas.role_permissions', {
    context: 'viewer',
    quantityOfAreas: kubernetesQuantityOfAreas
  });

  return {
    countOfKubernetesItemsWithAccess,
    kubernetesAccess,
    pcfAccess,
    vSphereAccess,
    phmcAccess,
    zhmcAccess,
    openStackAccess,
    sapAccess,
    hasOtherPlatformsAccess,
    kubernetesClustersWithAccess,
    kubernetesColumnHeadline,
    kubernetesNamespacesWithAccess,
    translations
  };
};
