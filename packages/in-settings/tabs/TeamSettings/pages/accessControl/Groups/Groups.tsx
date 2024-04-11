/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { Observable, create } from '@instana/observables';
import { ApiGroup, PermissionSet } from '@instana/types';
import { KeyValue, Link } from '@instana/components';

import {
  getEntityIdView,
  getEntityHref,
  teamSettingsAccessControlGroups,
  teamSettingsAccessControlGroupNew
} from 'in-settings/navigation/paths';
import { ProductAreaPermissionMap } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { ScopeRoles } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { deleteGroup, getGroupAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { TenantsWithUnits, getTenantsWithUnits } from 'in-api/account';
import { config } from 'in-services/config';
import { Trans, t } from 'in-i18n';

export const groupNameDefault = 'Default';
export const groupNameOwner = 'Owner';

const tableActions = {
  delete: {
    deleteEntity: ({ id }: ApiGroup) => deleteGroup(id),
    deleteProtection: ({ name }: ApiGroup) => name === groupNameDefault || name === groupNameOwner
  }
};

const getEntityName = (entity: ApiGroup) => {
  return t('in-settings:tabs.groupEntityName', { entityName: entity.name });
};

const determineAccess = (permissionSet: PermissionSet) => {
  for (const [, { limitation }] of Object.entries(ProductAreaPermissionMap)) {
    if (limitation && permissionSet.permissions?.includes(limitation)) {
      return t('in-settings:tabs.limitedAccess');
    }
  }

  return t('in-settings:tabs.accessAll');
};

const defaultColumnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    getContent: ({ name, id }: ApiGroup) => (
      <Link href={getEntityIdView(teamSettingsAccessControlGroups, id)}>
        <KeyValue value={name} label={''} inverted accentuated />
      </Link>
    )
  },
  {
    id: 'members',
    label: t('in-settings:tabs.numberOfMembers'),
    getContent: ({ members }: ApiGroup) => members?.length
  },
  {
    id: 'access',
    label: t('in-settings:tabs.access'),
    width: 15,
    getContent: ({ permissionSet }: ApiGroup) => determineAccess(permissionSet),
    getValue: ({ permissionSet }: ApiGroup) => determineAccess(permissionSet)
  }
];

const loadEntities = (): Observable<ApiGroup[]> => {
  const observer = create<ApiGroup[]>();
  getGroupAsResultObservable('').subscribe(next => {
    if (next.progress?.loading) return;
    if (next.data) {
      observer.emit(next.data);
    } else if (next.errors) {
      observer.emitError(next.errors);
    }
  });
  return observer;
};

const Groups = () => {
  const { goToPath } = useNavigation();
  const [tenantWithUnits, setTenantsWithUnits] = useState({});
  const [columnDefinitions, setColumnDefinitions] = useState(defaultColumnDefinitions);

  useEffect(() => {
    const result$ = getTenantsWithUnits();
    result$.once(data => {
      if (data[config.tenant]?.length > 0) {
        const fetchedTenantWithUnits = data[config.tenant][0] as TenantsWithUnits;
        setTenantsWithUnits(fetchedTenantWithUnits);

        if (columnDefinitions?.length > 2) {
          const newColumnDefinitions = [...columnDefinitions];
          // Update access label with tenant unit
          newColumnDefinitions[2].label =
            fetchedTenantWithUnits?.[config.tenant]?.length > 1
              ? t('in-settings:tabs.accessForTenantUnit', { tenantUnit: config?.tenantUnit, tenant: config?.tenant })
              : t('in-settings:tabs.access');
          setColumnDefinitions(newColumnDefinitions);
        }
      }
    });
  }, [columnDefinitions]);

  const getDialogMessage = (group: ApiGroup) => {
    const contributorApplicationIds = group?.permissionSet?.applicationIds?.filter(
      g => g.scopeRoleId === ScopeRoles.Contributor
    );
    const isContributorApplicationIdPresent =
      Array.isArray(contributorApplicationIds) && contributorApplicationIds.length > 0;

    return (
      <>
        {Array.isArray(tenantWithUnits) && tenantWithUnits.length > 1 ? (
          <Trans i18nKey="in-settings:tabs.deleteGroupMessage" values={{ groupName: group?.name }} />
        ) : (
          <Trans i18nKey="in-settings:components.confirmRemoveItem" values={{ itemName: group?.name }} />
        )}
        {isContributorApplicationIdPresent && (
          <>
            <br />
            <Trans
              i18nKey="in-settings:tabs.thisWillRemoveContributionFilterMessage"
              values={{ apCount: contributorApplicationIds.length }}
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      <List
        title={t('in-settings:tabs.groups')}
        getHeader={defaultHeaderWithCount(t('in-settings:tabs.groups'))}
        getEntityName={getEntityName}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        loadEntities={loadEntities}
        initialOrderBy="name"
        onCreateNew={() => goToPath(teamSettingsAccessControlGroupNew)}
        labelNew={t('in-settings:tabs.addGroup')}
        searchAttributes={['name']}
        searchPlaceholder={t('in-settings:components.search')}
        onRowClick={(group: ApiGroup) => {
          goToPath(getEntityHref(teamSettingsAccessControlGroups, group.id));
        }}
        customDeleteTooltipMessage={(group: ApiGroup) =>
          group?.name === groupNameDefault || group?.name === groupNameOwner
            ? t('in-settings:tabs.groupDeleteTooltip', { context: group.name })
            : t('in-settings:components.deleteEntity', { entity: group.name })
        }
        customDialogMessage={(group: ApiGroup) => getDialogMessage(group)}
        boundedPath="/groups"
      />
    </>
  );
};

export default Groups;
