/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles, GroupWithRoles } from '@instana/types';
import { Li, LoadingSkeleton } from '@instana/components';

import RolesAndAccessScopeOverview from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/RolesAndAccessScopeOverview';
import { useGetGroupsForEmail } from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/hooks/useGetGroupsForEmail';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

interface RoleAndAccessScopeColumnsProps {
  email: string;
}

export default function RoleAndAccessScopeColumns({ email }: RoleAndAccessScopeColumnsProps) {
  const [groups, , , { loading }] = useGetGroupsForEmail(email);
  if (loading) {
    return (
      <Li>
        <LoadingSkeleton />
      </Li>
    );
  }

  const permissionsSet: PermissionSetWithRoles = mergeGroupsAndMapToPermissionSet(groups);
  return (
    <LightCard title={t('in-settings:roleAndAccessScope.productArea')}>
      {permissionsSet && <RolesAndAccessScopeOverview permissionsSet={permissionsSet} />}
    </LightCard>
  );
}

function mergeGroupsAndMapToPermissionSet(groups: GroupWithRoles[] | undefined) {
  const permissionSet = {
    applicationIds: [],
    kubernetesClusterUUIDs: [],
    kubernetesNamespaceUIDs: [],
    mobileAppIds: [],
    permissions: [],
    websiteIds: []
  };
  if (!groups) return permissionSet;

  const groupValues = groups.values();
  for (const group of groupValues) {
    enrich(permissionSet, group);
  }
  return permissionSet;
}

const removeDuplicates = (array: any[]) => Array.from(new Set(array));

function enrich(permissionSet: any, group: any) {
  permissionSet.applicationIds = removeDuplicates([
    ...permissionSet.applicationIds,
    ...group.permissionSet.applicationIds
  ]);
  permissionSet.kubernetesClusterUUIDs = removeDuplicates([
    ...permissionSet.kubernetesClusterUUIDs,
    ...group.permissionSet.kubernetesClusterUUIDs
  ]);
  permissionSet.kubernetesNamespaceUIDs = removeDuplicates([
    ...permissionSet.kubernetesNamespaceUIDs,
    ...group.permissionSet.kubernetesNamespaceUIDs
  ]);
  permissionSet.mobileAppIds = removeDuplicates([...permissionSet.mobileAppIds, ...group.permissionSet.mobileAppIds]);
  permissionSet.websiteIds = removeDuplicates([...permissionSet.websiteIds, ...group.permissionSet.websiteIds]);
  permissionSet.permissions = removeDuplicates([...permissionSet.permissions, ...group.permissionSet.permissions]);
}
