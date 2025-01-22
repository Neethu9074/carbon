/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { TrashCan } from '@carbon/icons-react';
import React from 'react';

import { create, Observable } from '@instana/observables';
import { ApiGroup, PermissionSet } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import {
  getEntityIdView,
  securityAndAccessAccessControlGroups,
  securityAndAccessAccessControlGroupNew
} from 'in-settings/navigation/paths';
import { ProductAreaPermissionMap } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import CarbonDataTableWrapper, {
  DataTableRow
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { deleteGroup, deleteGroups, getGroupAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { ScopeRoles } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { useTenantUnitsInfo } from 'in-settings/hooks/useTenantUnitsInfo';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { config } from 'in-services/config';
import { Trans, t } from 'in-i18n';
import { Result } from 'in-types';

export const groupNameDefault = 'Default';
export const groupNameOwner = 'Owner';

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

const tableActions = {
  delete: {
    deleteEntity: ({ id }: ApiGroup) => deleteGroup(id),
    batchDeleteEntity: (ids: string[]) => deleteGroups(ids)
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

const getHeaders = (accessColumnHeadLabel: string) => {
  return [
    {
      key: 'name',
      header: t('in-settings:tabs.name')
    },
    {
      key: 'members',
      header: t('in-settings:tabs.numberOfMembers')
    },
    {
      key: 'access',
      header: accessColumnHeadLabel
    }
  ];
};
const isDisabledDelete = (groupName: string) => groupName === groupNameDefault || groupName === groupNameOwner;

const getBatchActionItems = () => {
  return [
    {
      renderIcon: TrashCan,
      actionName: t('in-settings:components.delete'),
      actionType: 'delete'
    }
  ];
};
const GroupsV2 = () => {
  const { goToPath } = useNavigation();
  const showTenantInfo = useTenantUnitsInfo();
  const dataTableResult = useObservable(loadEntities, []) ?? pendingResult;
  const loading = isLoading(dataTableResult as Result<any>);
  const entities = !loading ? (dataTableResult as ApiGroup[]) : [];
  const pageSizes = [20, 50];
  const rows = entities?.map((group: ApiGroup) => ({
    name: <Link href={getEntityIdView(securityAndAccessAccessControlGroups, group.id)}>{group.name}</Link>,
    members: group.members.length,
    access: determineAccess(group.permissionSet),
    id: group.id,
    rowData: { ...group, members: group.members.length, access: determineAccess(group.permissionSet) },
    disabled: isDisabledDelete(group.name)
  }));

  const accessColumnHeadLabel = !showTenantInfo
    ? t('in-settings:tabs.access')
    : t('in-settings:tabs.accessForTenantUnit', { tenantUnit: config?.tenantUnit, tenant: config?.tenant });

  const headers = getHeaders(accessColumnHeadLabel);

  const getMenuItems = (row: DataTableRow<any[]>) => {
    const group = entities.filter(item => item.id === row.id)[0];
    return [
      {
        actionType: 'delete',
        icon: <TrashCan />,
        isDisabledMenuItem: row.disabled,
        label:
          group?.name === groupNameDefault || group?.name === groupNameOwner
            ? t('in-settings:tabs.groupDeleteTooltip', { context: group.name })
            : t('in-settings:components.deleteEntity', { entity: group.name })
      }
    ];
  };
  const getDialogMessage = (groups: ApiGroup | ApiGroup[], isBatchDelete: boolean) => {
    let contributorApplicationIds, isContributorApplicationIdPresent, groupName;
    if (!isBatchDelete) {
      contributorApplicationIds = (groups as ApiGroup)?.permissionSet?.applicationIds?.filter(
        g => g.scopeRoleId === ScopeRoles.Contributor
      );
      isContributorApplicationIdPresent =
        Array.isArray(contributorApplicationIds) && contributorApplicationIds.length > 0;
      groupName = (groups as ApiGroup).name;
    } else {
      contributorApplicationIds = (groups as ApiGroup[]).filter(g =>
        g.permissionSet.applicationIds.some(g => g.scopeRoleId === ScopeRoles.Contributor)
      );
      isContributorApplicationIdPresent =
        Array.isArray(contributorApplicationIds) && contributorApplicationIds.length > 0;
      groupName = t('in-settings:tabs.noOfItemsSelected', { noOfItemsSelected: (groups as ApiGroup[]).length });
    }
    return (
      <>
        {showTenantInfo ? (
          <Trans i18nKey="in-settings:tabs.deleteGroupMessage" values={{ groupName: groupName }} />
        ) : (
          <Trans i18nKey="in-settings:components.confirmRemoveItem" values={{ itemName: groupName }} />
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
    <CarbonDataTableWrapper
      title={t('in-settings:tabs.groups')}
      tableHeaders={headers}
      tableRows={rows}
      loading={loading}
      searchPlaceholderText={t('in-settings:components.search')}
      searchAttributes={['name']}
      initalSortConfig={{ key: 'name', direction: 'asc' }}
      onCreateNew={() => goToPath(securityAndAccessAccessControlGroupNew)}
      labelNew={t('in-settings:tabs.addGroup')}
      getMenuItems={getMenuItems}
      getBatchActionItems={getBatchActionItems}
      boundedPath="/groups"
      pageSizes={pageSizes}
      customDialogMessage={(group: ApiGroup) => getDialogMessage(group, false)}
      customBatchDeleteMessage={(groups: ApiGroup[]) => getDialogMessage(groups, true)}
      getEntityName={getEntityName}
      tableActions={tableActions}
    />
  );
};
export default GroupsV2;
