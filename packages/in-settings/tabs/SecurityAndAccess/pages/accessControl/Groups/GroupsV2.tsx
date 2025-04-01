/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { TrashCan } from '@carbon/icons-react';
import React from 'react';

import { ApiGroup, PermissionSet } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import {
  getEntityIdView,
  securityAndAccessAccessControlGroups,
  securityAndAccessAccessControlGroupNew
} from 'in-settings/navigation/paths';
import MultiSelectDataTable, {
  DataTableRow,
  Notification
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { ProductAreaPermissionMap } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { ScopeRoles } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { deleteGroup, deleteGroups, getGroups } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { useTenantUnitsInfo } from 'in-settings/hooks/useTenantUnitsInfo';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hasError, isLoading } from 'in-services/util/result';
import { STATIC_GROUP_NAMES } from 'in-settings/constants';
import { pendingResult } from 'in-services/fixedObjects';
import { config } from 'in-services/config';
import { Trans, t } from 'in-i18n';

interface GroupData extends Omit<ApiGroup, 'members'> {
  members: number;
  access: string;
}

const tableActions = {
  delete: {
    deleteEntity: ({ id }: GroupData) => deleteGroup(id),
    batchDeleteEntity: (ids: string[]) => deleteGroups(ids)
  }
};

const getEntityName = (entity: GroupData) => {
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
const isDisabledDelete = (groupName: string) => Object.values<string>(STATIC_GROUP_NAMES).includes(groupName);

interface RowObject<ROW_DATA> {
  name: JSX.Element;
  members: number;
  access: string;
  id: string;
  rowData: ROW_DATA;
  disabled: boolean;
}

function isBatchDeletableGroupsArray(groups: GroupData | GroupData[], isBatchDelete?: boolean): groups is GroupData[] {
  return Array.isArray(groups) && isBatchDelete === true;
}

const getBatchActionItems = () => {
  return [
    {
      renderIcon: TrashCan,
      actionName: t('in-settings:components.delete'),
      actionType: 'delete'
    }
  ];
};

const createMenuItemsForRow = (
  groups: ApiGroup[],
  row: Omit<DataTableRow<RowObject<ApiGroup>[], ApiGroup>, 'rowData'>
) => {
  const group = groups.filter(item => item.id === row.id)[0];
  return [
    {
      actionType: 'delete',
      icon: <TrashCan />,
      isDisabledMenuItem: row.disabled,
      label: Object.values<string>(STATIC_GROUP_NAMES).includes(group.name)
        ? t('in-settings:tabs.groupDeleteTooltip', { context: group.name })
        : t('in-settings:components.deleteEntity', { entity: group.name })
    }
  ];
};
const createTableRows = (groups: ApiGroup[] = []): Array<RowObject<GroupData>> => {
  return groups?.map((group: ApiGroup) => ({
    name: <Link href={getEntityIdView(securityAndAccessAccessControlGroups, group.id)}>{group.name}</Link>,
    members: group.members.length,
    access: determineAccess(group.permissionSet),
    id: group.id,
    rowData: { ...group, members: group.members.length, access: determineAccess(group.permissionSet) },
    disabled: isDisabledDelete(group.name)
  }));
};

const GroupsV2 = () => {
  const { goToPath } = useNavigation();
  const showTenantInfo = useTenantUnitsInfo();
  const dataTableResult = useObservable(getGroups, []) ?? pendingResult;
  const hasErrors = hasError(dataTableResult);
  const loading = isLoading(dataTableResult);
  const errorMessage: Notification | undefined = hasErrors
    ? {
        title: t('in-settings:components.errorFailedToLoadData'),
        subtitle: dataTableResult.errors[0].message,
        kind: 'error'
      }
    : undefined;
  const groups = dataTableResult?.data ?? [];
  const pageSizes = [20, 50];

  const accessColumnHeadLabel = !showTenantInfo
    ? t('in-settings:tabs.access')
    : t('in-settings:tabs.accessForTenantUnit', { tenantUnit: config?.tenantUnit, tenant: config?.tenant });

  const headers = getHeaders(accessColumnHeadLabel);

  const getDialogMessage = (groups: GroupData | GroupData[], isBatchDelete: boolean) => {
    const isBatchDeletable = isBatchDeletableGroupsArray(groups, isBatchDelete);

    let contributorApplicationIds, isContributorApplicationIdPresent, groupName;
    if (!isBatchDeletable) {
      contributorApplicationIds = groups.permissionSet?.applicationIds?.filter(
        g => g.scopeRoleId === ScopeRoles.Contributor
      );
      isContributorApplicationIdPresent =
        Array.isArray(contributorApplicationIds) && contributorApplicationIds.length > 0;
      groupName = groups.name;
    } else {
      contributorApplicationIds = groups.filter(g =>
        g.permissionSet.applicationIds.some(g => g.scopeRoleId === ScopeRoles.Contributor)
      );
      isContributorApplicationIdPresent =
        Array.isArray(contributorApplicationIds) && contributorApplicationIds.length > 0;
      groupName = t('in-settings:tabs.noOfItemsSelected', { noOfItemsSelected: groups.length });
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
    <MultiSelectDataTable
      title={t('in-settings:tabs.groups')}
      tableHeaders={headers}
      tableRows={createTableRows(dataTableResult.data)}
      loading={loading}
      searchPlaceholderText={t('in-settings:components.search')}
      searchAttributes={['name']}
      initalSortConfig={{ key: 'name', direction: 'asc' }}
      onCreateNew={() => goToPath(securityAndAccessAccessControlGroupNew)}
      labelNew={t('in-settings:tabs.addGroup')}
      getMenuItems={row => createMenuItemsForRow(groups, row)}
      getBatchActionItems={getBatchActionItems}
      boundedPath="/groups"
      pageSizes={pageSizes}
      customDialogMessage={group => getDialogMessage(group, false)}
      customBatchDeleteMessage={groups => getDialogMessage(groups, true)}
      getEntityName={getEntityName}
      tableActions={tableActions}
      message={errorMessage}
    />
  );
};
export default GroupsV2;
