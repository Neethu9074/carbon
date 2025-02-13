/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode, useState } from 'react';
import { TrashCan } from '@carbon/icons-react';

import { Link, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import CarbonDataTableWrapper, {
  DataTableRow,
  Notification,
  TableActions
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { ApiTeam, getTeamsResult, deleteTeam, deleteTeams } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import CreateTeamDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/CreateTeamDialog';
import { getEntityIdView, securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import config from 'in-services/config';
import { Trans, t } from 'in-i18n';
import { Result } from 'in-types';

const headers = [
  {
    key: 'tag',
    header: t('in-settings:tabs.name')
  },
  {
    key: 'memberCount',
    header: t('in-settings:tabs.numberOfMembers')
  },
  {
    key: 'scope',
    header: (
      <Trans i18nKey="in-settings:tabs.scopeOn" values={{ tenantUnit: config.tenantUnit, tenant: config.tenant }} />
    )
  }
];

const tableActions: TableActions<TeamRowData> = {
  delete: {
    deleteEntity: entity => deleteTeam(entity.id),
    batchDeleteEntity: selectedIds => deleteTeams(selectedIds)
  }
};

const getBatchActionItems = () => {
  return [
    {
      renderIcon: TrashCan,
      actionName: t('in-settings:components.delete'),
      actionType: 'delete'
    }
  ];
};

// TODO define scope type and compute scope value based on scope values, currently only dummy implementation
const getScopeValue = (scope: object) => {
  if (scope) {
    return t('in-settings:tabs.teams.scopeLimitedOnUnit');
  } else {
    return t('in-settings:tabs.teams.scopeEntireUnit');
  }
};

interface TeamRowData extends Omit<ApiTeam, 'scope'> {
  memberCount: number;
  scope: string;
}

interface TeamRow<ROW_DATA> {
  id: string;
  memberCount: ReactNode;
  rowData: ROW_DATA;
  scope: ReactNode;
  tag: ReactNode;
}

const Teams = () => {
  const pageSizes = [20, 50];
  const dataTableResult = useObservable(getTeamsResult, []) ?? pendingResult;
  const loading = isLoading(dataTableResult as Result<ApiTeam>);
  const hasErrors = hasError(dataTableResult as Readonly<Result<ApiTeam[]>>);
  const [message, setMessage] = useState<Notification>();
  const entities = !loading && !hasErrors ? (dataTableResult as ApiTeam[]) : [];
  const errorMessage = hasErrors
    ? ({
        title: t('in-settings:components.errorFailedToLoadData'),
        subtitle: (dataTableResult as Readonly<Result<ApiTeam[]>>).errors[0].message,
        kind: 'error'
      } as Notification)
    : null;

  const rows: Array<TeamRow<TeamRowData>> = entities?.map((team: ApiTeam) => ({
    tag: (
      <Link href={getEntityIdView(securityAndAccessAccessControlTeams, team.id)} ellipsis>
        <Typography variant="body-regular" noMargin component="p">
          {team.tag}
        </Typography>
      </Link>
    ),
    memberCount: (
      <span>{team.members?.length && <Typography variant="body-regular">{team.members.length}</Typography>}</span>
    ),
    scope: <span>{getScopeValue(team?.scope)}</span>,
    id: team.id,
    rowData: { ...team, memberCount: team.members?.length, scope: getScopeValue(team?.scope) }
  }));

  const getMenuItems = (row: Omit<DataTableRow<TeamRow<TeamRowData>[], TeamRowData>, 'rowData'>) => {
    const team = entities.filter(item => item.id === row.id)[0];
    const { tag } = team;
    return [
      {
        actionType: 'delete',
        icon: <TrashCan />,
        label: t('in-settings:components.deleteEntity', { entity: tag })
      }
    ];
  };

  return (
    <>
      <CarbonDataTableWrapper
        title={t('in-settings:tabs.teams.teamsTitle')}
        tableHeaders={headers}
        tableRows={rows}
        loading={loading}
        searchPlaceholderText={t('in-settings:components.search')}
        searchAttributes={['tag']}
        initalSortConfig={{ key: 'tag', direction: 'asc' }}
        onCreateNew={() => {
          addActiveDialog(<CreateTeamDialog setMessage={setMessage} />);
        }}
        labelNew={t('in-settings:tabs.newTeam')}
        getMenuItems={getMenuItems}
        getBatchActionItems={getBatchActionItems}
        boundedPath="/teams"
        getEntityName={({ tag }) => t('in-settings:tabs.teams.teamWithName', { name: tag })}
        pageSizes={pageSizes}
        tableActions={tableActions}
        message={errorMessage ? errorMessage : message}
      />
    </>
  );
};

export default Teams;
