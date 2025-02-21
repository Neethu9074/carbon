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
  TEAMS_TABLE_ACTIONS,
  TEAMS_TABLE_BATCH_ACTIONS,
  TEAMS_TABLE_HEADERS,
  TEAMS_TABLE_PAGE_SIZES,
  TEAMS_TABLE_ORDER
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/Teams.constants';
import CarbonDataTableWrapper, {
  DataTableRow,
  Notification
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { TeamRow, TeamRowData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/Teams.types';
import CreateTeamDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/CreateTeamDialog';
import { getEntityIdView, securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { ApiTeam, getTeamsResult } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

// TODO define scope type and compute scope value based on scope values, currently only dummy implementation
const getScopeValue = (scope: object) => {
  if (scope) {
    return t('in-settings:tabs.teams.scopeLimitedOnUnit');
  } else {
    return t('in-settings:tabs.teams.scopeEntireUnit');
  }
};

const createMenuItemsForRow = (
  teams: ApiTeam[],
  row: Omit<DataTableRow<TeamRow<TeamRowData>[], TeamRowData>, 'rowData'>
) => {
  const team = teams.filter(item => item.id === row.id)[0];
  const { tag } = team;
  return [
    {
      actionType: 'delete',
      icon: <TrashCan />,
      label: t('in-settings:components.deleteEntity', { entity: tag })
    }
  ];
};

const createTableRows = (teams: ApiTeam[] = []): Array<TeamRow<TeamRowData>> => {
  return teams?.map((team: ApiTeam) => ({
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
};

const Teams = () => {
  const dataTableResult = useObservable(getTeamsResult, []) ?? pendingResult;
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
    <CarbonDataTableWrapper
      boundedPath="/teams"
      getBatchActionItems={() => TEAMS_TABLE_BATCH_ACTIONS}
      getEntityName={({ tag }) => t('in-settings:tabs.teams.teamWithName', { name: tag })}
      getMenuItems={row => createMenuItemsForRow(dataTableResult.data, row)}
      initalSortConfig={TEAMS_TABLE_ORDER}
      labelNew={t('in-settings:tabs.newTeam')}
      loading={loading}
      message={errorMessage || message}
      onCreateNew={() => {
        addActiveDialog(<CreateTeamDialog setMessage={setMessage} />);
      }}
      pageSizes={TEAMS_TABLE_PAGE_SIZES}
      searchAttributes={['tag']}
      searchPlaceholderText={t('in-settings:components.search')}
      tableActions={TEAMS_TABLE_ACTIONS}
      tableHeaders={TEAMS_TABLE_HEADERS}
      tableRows={createTableRows(dataTableResult.data)}
      title={t('in-settings:tabs.teams.teamsTitle')}
    />
  );
};

export default Teams;
