/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React, { useState } from 'react';

import { Link, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TeamOverview } from '@instana/types';

import {
  TEAMS_TABLE_ACTIONS,
  TEAMS_TABLE_BATCH_ACTIONS,
  TEAMS_TABLE_HEADERS,
  TEAMS_TABLE_PAGE_SIZES,
  TEAMS_TABLE_ORDER
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/Teams.constants';
import MultiSelectDataTable, {
  DataTableRow,
  Notification
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import CreateTeamDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/CreateTeamDialog';
import { getEntityIdView, securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { TeamRow } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/Teams.types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { getTeamsOverview } from 'in-api/teams';
import { t } from 'in-i18n';

const createMenuItemsForRow = (
  teams: TeamOverview[],
  row: Omit<DataTableRow<TeamRow<TeamOverview>[], TeamOverview>, 'rowData'>
) => {
  const team = teams.filter(item => item.id === row.id)[0];
  const { name } = team;
  return [
    {
      actionType: 'delete',
      icon: <TrashCan />,
      label: t('in-settings:components.deleteEntity', { entity: name })
    }
  ];
};

const createTableRows = (
  createHrefToPath: (path: string) => string,
  teams: TeamOverview[] = []
): Array<TeamRow<TeamOverview>> => {
  return teams?.map((team: TeamOverview) => ({
    name: (
      <Link href={getEntityIdView(securityAndAccessAccessControlTeams, team.id, createHrefToPath)} ellipsis>
        {team.name}
      </Link>
    ),
    usersCount: (
      <span>
        <Typography variant="body-regular">{team.usersCount}</Typography>
      </span>
    ),
    scope: (
      <span>
        {team.hasScope ? t('in-settings:tabs.teams.scopeLimitedOnUnit') : t('in-settings:tabs.teams.scopeEntireUnit')}
      </span>
    ),
    id: team.id,
    rowData: { ...team }
  }));
};

const Teams = () => {
  const dataTableResult = useObservable(getTeamsOverview, []) ?? pendingResult;
  const loading = isLoading(dataTableResult);
  const hasErrors = hasError(dataTableResult);
  const { createHrefToPath } = useNavigation();
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
      getBatchActionItems={() => TEAMS_TABLE_BATCH_ACTIONS}
      getEntityName={({ name }) => t('in-settings:tabs.teams.teamWithName', { name: name })}
      getMenuItems={row => createMenuItemsForRow(dataTableResult.data, row)}
      initalSortConfig={TEAMS_TABLE_ORDER}
      labelNew={t('in-settings:tabs.newTeam')}
      loading={loading}
      message={errorMessage || message}
      onCreateNew={() => {
        addActiveDialog(<CreateTeamDialog setMessage={setMessage} />);
      }}
      pageSizes={TEAMS_TABLE_PAGE_SIZES}
      searchAttributes={['name']}
      searchPlaceholderText={t('in-settings:components.search')}
      tableActions={TEAMS_TABLE_ACTIONS}
      tableHeaders={TEAMS_TABLE_HEADERS}
      tableRows={createTableRows(createHrefToPath, dataTableResult.data)}
      title={t('in-settings:tabs.teams.teamsTitle')}
    />
  );
};

export default Teams;
