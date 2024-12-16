/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { PermissionSet, ApiGroup, ScopeBinding } from '@instana/types';
import { Li, LoadingSkeleton } from '@instana/components';

import RolesAndAccessScopeOverview from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/RolesAndAccessScopeOverview';
import { getGroupsOfASingleUserAsResult } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/hooks/useGetGroupsForEmail';
import { ScopeRoles } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { fallBackPermissions } from 'in-stores/permission';
import { ownerRoleId } from 'in-stores/user';
import config from 'in-services/config';
import { t } from 'in-i18n';

interface RoleAndAccessScopeColumnsProps {
  email: string;
  refresh: boolean;
}

export default function RoleAndAccessScopeColumns({ email, refresh }: RoleAndAccessScopeColumnsProps) {
  const [loading, setLoading] = useState(true);
  const [permissionsSet, setPermissionsSet] = useState<PermissionSet | undefined>(undefined);

  useEffect(() => {
    // Refreshes permissionsSet initially or when triggered by removing or adding groups for a user
    setLoading(true);
    const groupsObservable = getGroupsOfASingleUserAsResult(email);
    const groupsDisposable = groupsObservable.subscribe(result => {
      if (result?.data) {
        // Groups have been fetched
        setPermissionsSet(mergeGroupsAndMapToPermissionSet(result.data));
        setLoading(false);
      }
    });

    return () => {
      // Clean up
      groupsDisposable.dispose();
    };
  }, [email, refresh]);

  if (loading) {
    return (
      <Li>
        <LoadingSkeleton />
      </Li>
    );
  }

  return (
    <LightCard
      title={t('in-settings:roleAndAccessScope.productArea', { tenantUnit: config.tenantUnit, tenant: config.tenant })}
    >
      {permissionsSet && <RolesAndAccessScopeOverview permissionsSet={permissionsSet} />}
    </LightCard>
  );
}

function mergeGroupsAndMapToPermissionSet(groups: ApiGroup[] | undefined): PermissionSet {
  const permissionSet = {
    websiteIds: [],
    mobileAppIds: [],
    businessPerspectiveIds: [],
    applicationIds: [],
    kubernetesClusterUUIDs: [],
    kubernetesNamespaceUIDs: [],
    permissions: [],
    syntheticCredentialKeys: [],
    syntheticTestIds: [],
    infraDfqFilter: { scopeId: '', scopeRoleId: '-1' },
    actionFilter: { scopeId: undefined, scopeRoleId: '-1' }
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

// If scope binding contains same ids with different scopeRoleIds return only most permissive pair
const transformToMostPermissive = (scopeBindings: ScopeBinding[]): ScopeBinding[] => {
  const newBinding: ScopeBinding[] = [];
  const mostPermissiveMap: { [key: string]: string } = {};
  for (const binding of scopeBindings) {
    const scopeRoleId = binding?.scopeRoleId ? binding?.scopeRoleId : '-1';

    if (binding?.scopeId) {
      if (binding.scopeId in mostPermissiveMap) {
        const prevScopeRoleId = mostPermissiveMap[binding.scopeId];
        // Scope roles viewer, contributor and -1 are candidates for being updated with more permissive scope role e.g. owner
        if (
          (prevScopeRoleId === ScopeRoles.Viewer &&
            (scopeRoleId === ScopeRoles.Owner || scopeRoleId === ScopeRoles.Contributor)) ||
          (prevScopeRoleId === ScopeRoles.Contributor && scopeRoleId === ScopeRoles.Owner) ||
          prevScopeRoleId === '-1'
        ) {
          // Update with more permissive scopeRoleId
          mostPermissiveMap[binding.scopeId] = scopeRoleId;
        }
      } else {
        // Add scopeRoleId to most permissive map
        mostPermissiveMap[binding.scopeId] = scopeRoleId;
      }
    }
  }

  // Return most permissive scopeRoleId for scopeId
  for (const scopeId in mostPermissiveMap) {
    newBinding.push({ scopeId: scopeId, scopeRoleId: mostPermissiveMap[scopeId] });
  }

  return newBinding;
};

function enrich(permissionSet: any, group: any) {
  permissionSet.websiteIds = removeDuplicates([...permissionSet.websiteIds, ...group.permissionSet.websiteIds]);
  permissionSet.mobileAppIds = removeDuplicates([...permissionSet.mobileAppIds, ...group.permissionSet.mobileAppIds]);
  permissionSet.applicationIds = transformToMostPermissive(
    removeDuplicates([...permissionSet.applicationIds, ...group.permissionSet.applicationIds])
  );
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
  if (group.permissionSet.restrictedApplicationFilter) {
    if (permissionSet.restrictedApplicationFilter) {
      permissionSet.restrictedApplicationFilter = removeDuplicates([
        ...permissionSet.restrictedApplicationFilter,
        { ...group.permissionSet.restrictedApplicationFilter }
      ]);
    } else {
      permissionSet.restrictedApplicationFilter = [group.permissionSet.restrictedApplicationFilter];
    }
  }
  permissionSet.syntheticTestIds = removeDuplicates([
    ...permissionSet.syntheticTestIds,
    ...group.permissionSet.syntheticTestIds
  ]);

  if (group.permissionSet.actionFilter?.scopeId) {
    if (permissionSet.actionFilter.scopeId) {
      permissionSet.actionFilter.scopeId = permissionSet.actionFilter.scopeId.concat(' OR ');
    }
    permissionSet.actionFilter.scopeId = permissionSet.actionFilter.scopeId.concat(
      group.permissionSet.actionFilter.scopeId.trim()
    );
  }
}
