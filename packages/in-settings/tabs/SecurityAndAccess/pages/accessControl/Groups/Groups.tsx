/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Observable, create } from '@instana/observables';
import { ApiGroup, PermissionSet } from '@instana/types';
import { KeyValue, Link } from '@instana/components';

import {
  getEntityIdView,
  getEntityHref,
  securityAndAccessAccessControlGroups,
  securityAndAccessAccessControlGroupNew
} from 'in-settings/navigation/paths';
import { ProductAreaPermissionMap } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { ScopeRoles } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { deleteGroup, getGroupAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { useTenantUnitsInfo } from 'in-settings/hooks/useTenantUnitsInfo';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
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

const getColumnDefinitions = (
  accessColumnHeadLabel: string,
  createHrefToPath: (path: string, params?: Record<string, string>) => string
) => [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    getContent: ({ name, id }: ApiGroup) => (
      <Link href={getEntityIdView(securityAndAccessAccessControlGroups, id, createHrefToPath)}>
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
    label: accessColumnHeadLabel,
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
  const { goToPath, createHrefToPath } = useNavigation();
  const showTenantInfo = useTenantUnitsInfo();

  const accessColumnHeadLabel = !showTenantInfo
    ? t('in-settings:tabs.access')
    : t('in-settings:tabs.accessForTenantUnit', { tenantUnit: config?.tenantUnit, tenant: config?.tenant });

  const columnDefinitions = getColumnDefinitions(accessColumnHeadLabel, createHrefToPath);

  const getDialogMessage = (group: ApiGroup) => {
    const contributorApplicationIds = group?.permissionSet?.applicationIds?.filter(
      g => g.scopeRoleId === ScopeRoles.Contributor
    );
    const isContributorApplicationIdPresent =
      Array.isArray(contributorApplicationIds) && contributorApplicationIds.length > 0;

    return (
      <>
        {showTenantInfo ? (
          <Trans i18nKey="in-settings:tabs.deleteGroupMessage" values={{ groupName: group?.name }} />
        ) : (
          <Trans i18nKey="in-settings:components.confirmRemoveItem" values={{ itemName: group?.name }} />
        )}
        {isContributorApplicationIdPresent && (
          <>
            <br />
            {showTenantInfo ? (
              <Trans
                i18nKey="in-settings:tabs.thisWillRemoveContributionFilterFromOtherUnits"
                values={{ apCount: contributorApplicationIds.length }}
              />
            ) : (
              <Trans
                i18nKey="in-settings:tabs.thisWillRemoveContributionFilterMessage"
                values={{ apCount: contributorApplicationIds.length }}
              />
            )}
          </>
        )}
      </>
    );
  };

  return (
    <List
      title={t('in-settings:tabs.groups')}
      getHeader={defaultHeaderWithCount(t('in-settings:tabs.groups'))}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={loadEntities}
      initialOrderBy="name"
      onCreateNew={() => goToPath(securityAndAccessAccessControlGroupNew)}
      labelNew={t('in-settings:tabs.addGroup')}
      searchAttributes={['name']}
      searchPlaceholder={t('in-settings:components.search')}
      onRowClick={(group: ApiGroup) => {
        goToPath(getEntityHref(securityAndAccessAccessControlGroups, group.id));
      }}
      customDeleteTooltipMessage={(group: ApiGroup) =>
        group?.name === groupNameDefault || group?.name === groupNameOwner
          ? t('in-settings:tabs.groupDeleteTooltip', { context: group.name })
          : t('in-settings:components.deleteEntity', { entity: group.name })
      }
      customDialogMessage={(group: ApiGroup) => getDialogMessage(group)}
      boundedPath="/groups"
    />
  );
};

export default Groups;
