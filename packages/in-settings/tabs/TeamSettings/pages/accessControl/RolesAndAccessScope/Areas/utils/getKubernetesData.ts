/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PermissionSetWithRoles } from '@instana/types';

import {
  openstackEnabled,
  pcfEnabled,
  phmcEnabled,
  vsphereEnabled,
  zhmcEnabled,
  sapEnabled
} from 'in-services/featureFlags';
import { AreaPermission } from 'in-stores/permission';
import { t } from 'in-i18n';

// This function can be broken into multiple smaller ones
// Once we rework platform access booleans 'in packages/in-stores/permission.ts'
export const getKubernetesData = (permissionsSet: PermissionSetWithRoles) => {
  const { kubernetesClusterUUIDs, kubernetesNamespaceUIDs, permissions } = permissionsSet;

  const hasKubernetesAccess = permissions.includes(AreaPermission.ACCESS_KUBERNETES);
  const hasVSphereAccess = permissions.includes(AreaPermission.ACCESS_VSPHERE) && vsphereEnabled;
  const hasPHMCAccess = permissions.includes(AreaPermission.ACCESS_PHMC) && phmcEnabled;
  const hasZHMCAccess = permissions.includes(AreaPermission.ACCESS_ZHMC) && zhmcEnabled;
  const hasOpenStackAccess = permissions.includes(AreaPermission.ACCESS_OPENSTACK) && openstackEnabled;
  const hasPCFAccess = permissions.includes(AreaPermission.ACCESS_PCF) && pcfEnabled;
  const hasSAPAccess = permissions.includes(AreaPermission.ACCESS_SAP) && sapEnabled;
  const countOfKubernetesItemsWithAccess = kubernetesClusterUUIDs.length + kubernetesNamespaceUIDs.length;

  const translations = [];

  if (hasKubernetesAccess) {
    translations.push(t('in-settings:productAreas.kubernetes'));
  }
  if (hasVSphereAccess) {
    translations.push(t('in-settings:productAreas.vsphere'));
  }
  if (hasPHMCAccess) {
    translations.push(t('in-settings:productAreas.phmc'));
  }
  if (hasZHMCAccess) {
    translations.push(t('in-settings:productAreas.zhmc'));
  }
  if (hasOpenStackAccess) {
    translations.push(t('in-settings:productAreas.openstack'));
  }
  if (hasPCFAccess) {
    translations.push(t('in-settings:productAreas.pcf'));
  }
  if (hasSAPAccess) {
    translations.push(t('in-settings:productAreas.sap'));
  }
  const hasOtherPlatformsAccess =
    hasVSphereAccess || hasPHMCAccess || hasZHMCAccess || hasOpenStackAccess || hasPCFAccess || hasSAPAccess;

  const kubernetesNamespacesWithAccess = kubernetesNamespaceUIDs.map(namespace => namespace.scopeId);

  const kubernetesColumnHeadline = t('in-settings:productAreas.role_permissions', {
    context: 'viewer',
    quantityOfAreas: countOfKubernetesItemsWithAccess
  });

  return {
    countOfKubernetesItemsWithAccess,
    hasKubernetesAccess,
    hasOtherPlatformsAccess,
    kubernetesColumnHeadline,
    kubernetesNamespacesWithAccess,
    translations
  };
};
