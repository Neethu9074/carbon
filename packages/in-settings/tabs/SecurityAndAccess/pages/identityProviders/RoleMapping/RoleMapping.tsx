/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React, { useState } from 'react';

import { Link, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  ROLE_MAPPING_TABLE_ACTIONS,
  ROLE_MAPPING_TABLE_BATCH_ACTIONS,
  ROLE_MAPPING_TABLE_HEADERS,
  ROLE_MAPPING_TABLE_PAGE_SIZES,
  ROLE_MAPPING_TABLE_ORDER
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMapping.constants';
import MultiSelectDataTable, {
  DataTableRow,
  Notification,
  OverflowMenuItemProps
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { RoleMappingRow } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMapping.types';
import CreateTeamDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/CreateTeamDialog';
import { getMappings, IdpGroupMapping } from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';
import { getEntityIdView, securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

const createMenuItemsForRow = (
  roleMappings: IdpGroupMapping[],
  row: Omit<DataTableRow<RoleMappingRow<IdpGroupMapping>[], IdpGroupMapping>, 'rowData'>
): Array<OverflowMenuItemProps> => {
  const roleMapping = roleMappings.filter(item => item.id === row.id)[0];
  const { key } = roleMapping;
  return [
    {
      actionType: 'delete',
      icon: <TrashCan />,
      label: t('in-settings:components.deleteEntity', { entity: key })
    }
  ];
};

const createTableRows = (roleMappings: IdpGroupMapping[] = []): Array<RoleMappingRow<IdpGroupMapping>> => {
  return roleMappings?.map((roleMapping: IdpGroupMapping) => ({
    key: (
      <Link href={getEntityIdView(securityAndAccessAccessControlTeams, roleMapping?.id ?? '')} ellipsis>
        {roleMapping.key}
      </Link>
    ),
    value: (
      <span>
        <Typography variant="body-regular">{roleMapping.value}</Typography>
      </span>
    ),
    role: <span>{roleMapping.groupId}</span>,
    team: <span>{roleMapping.teamId}</span>,
    id: roleMapping?.id ?? '',
    rowData: { ...roleMapping }
  }));
};

const RoleMapping = () => {
  const dataTableResult = useObservable(getMappings, []) ?? pendingResult;
  const loading = isLoading(dataTableResult);
  const hasErrors = hasError(dataTableResult);
  const [message, setMessage] = useState<Notification>();
  const errorMessage: Notification | undefined = hasErrors
    ? {
        title: t('in-settings:components.errorFailedToLoadData'),
        subtitle: dataTableResult.errors[0].message,
        kind: 'error'
      }
    : undefined;

  return (
    <MultiSelectDataTable
      boundedPath="/teams"
      getBatchActionItems={() => ROLE_MAPPING_TABLE_BATCH_ACTIONS}
      getEntityName={({ key }) => t('in-settings:tabs.roleMapping.roleMappingWithName', { name: key })}
      getMenuItems={row => createMenuItemsForRow(dataTableResult.data, row)}
      initalSortConfig={ROLE_MAPPING_TABLE_ORDER}
      labelNew={t('in-settings:tabs.roleMapping.newMappingRule')}
      loading={loading}
      message={errorMessage || message}
      onCreateNew={() => {
        addActiveDialog(<CreateTeamDialog setMessage={setMessage} />);
      }}
      pageSizes={ROLE_MAPPING_TABLE_PAGE_SIZES}
      searchAttributes={['key', 'value', 'groupId', 'teamId']}
      searchPlaceholderText={t('in-settings:components.search')}
      tableActions={ROLE_MAPPING_TABLE_ACTIONS}
      tableHeaders={ROLE_MAPPING_TABLE_HEADERS}
      tableRows={createTableRows(dataTableResult.data)}
      title={t('in-settings:tabs.roleMapping.roleMappingTitle')}
    />
  );
};

export default RoleMapping;
