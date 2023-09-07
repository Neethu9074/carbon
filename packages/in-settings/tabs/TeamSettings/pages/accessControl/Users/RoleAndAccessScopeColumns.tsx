/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { PermissionSetWithRoles, GroupWithRoles } from '@instana/types';
import { Li, LoadingSkeleton } from '@instana/components';

import RolesAndAccessScopeOverview from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/RolesAndAccessScopeOverview';
import { getGroupsOfASingleUserAsResult } from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/hooks/useGetGroupsForEmail';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { fallBackPermissions } from 'in-stores/permission';
import { ownerRoleId } from 'in-stores/user';
import { t } from 'in-i18n';

interface RoleAndAccessScopeColumnsProps {
  email: string;
  refresh: boolean;
}

export default function RoleAndAccessScopeColumns({ email, refresh }: RoleAndAccessScopeColumnsProps) {
  const [loading, setLoading] = useState(true);
  const [permissionsSet, setPermissionsSet] = useState<PermissionSetWithRoles | undefined>(undefined);

  useEffect(() => {
    // Refreshes permissionsSet initially or when triggered by removing or adding groups for a user
    setLoading(true);
    const groupsObservable = getGroupsOfASingleUserAsResult(email);
    groupsObservable.once(result => {
      if (result?.data) {
        // Groups have been fetched
        setPermissionsSet(mergeGroupsAndMapToPermissionSet(result.data));
        setLoading(false);
      }
    });
  }, [email, refresh]);

  if (loading) {
    return (
      <Li>
        <LoadingSkeleton />
      </Li>
    );
  }

  return (
    <LightCard title={t('in-settings:roleAndAccessScope.productArea')}>
      {permissionsSet && <RolesAndAccessScopeOverview permissionsSet={permissionsSet} />}
    </LightCard>
  );
}

function mergeGroupsAndMapToPermissionSet(groups: GroupWithRoles[] | undefined): PermissionSetWithRoles {
  const permissionSet = {
    websiteIds: [],
    mobileAppIds: [],
    applicationIds: [],
    kubernetesClusterUUIDs: [],
    kubernetesNamespaceUIDs: [],
    permissions: [],
    infraDfqFilter: { scopeId: '', scopeRoleId: '-1' },
    syntheticTestIds: []
  };

  // users not being member of any group fall back to a restricted default
  if (!groups || groups.length === 0) return { ...permissionSet, permissions: fallBackPermissions };

  // OWNER always has all available permissions
  // without evaluating limited_*_scopes from all groups owners can not be limited on any area
  // similar to backend evaluations
  for (const group of groups.values()) {
    if (ownerRoleId === group.id) {
      enrich(permissionSet, group);
      return permissionSet;
    }
  }

  for (const group of groups.values()) {
    enrich(permissionSet, group);
  }
  return permissionSet;
}

const removeDuplicates = (array: any[]) => Array.from(new Set(array));

function enrich(permissionSet: any, group: any) {
  permissionSet.websiteIds = removeDuplicates([...permissionSet.websiteIds, ...group.permissionSet.websiteIds]);
  permissionSet.mobileAppIds = removeDuplicates([...permissionSet.mobileAppIds, ...group.permissionSet.mobileAppIds]);
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
  permissionSet.permissions = removeDuplicates([...permissionSet.permissions, ...group.permissionSet.permissions]);

  // needs to be concatinated with OR as represented via single scopeId value only
  if (group.permissionSet.infraDfqFilter?.scopeId) {
    if (permissionSet.infraDfqFilter.scopeId) {
      permissionSet.infraDfqFilter.scopeId = permissionSet.infraDfqFilter.scopeId.concat(' OR ');
    }
    permissionSet.infraDfqFilter.scopeId = permissionSet.infraDfqFilter.scopeId.concat(
      group.permissionSet.infraDfqFilter.scopeId.trim()
    );
  }

  permissionSet.syntheticTestIds = removeDuplicates([
    ...permissionSet.syntheticTestIds,
    ...group.permissionSet.syntheticTestIds
  ]);
}
