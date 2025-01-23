/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React, { useState } from 'react';

import { Link, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import CarbonDataTableWrapper, {
  DataTableRow,
  Notification
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import {
  ApiTeam,
  getTeamsAsResultObservable,
  deleteTeam,
  deleteTeams
} from 'in-settings/tabs/SecurityAndAccess/api/teams';
import CreateTeamDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/CreateTeamDialog';
import { getEntityIdView, securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import config from 'in-services/config';
import { Trans, t } from 'in-i18n';

const headers = [
  {
    key: 'name',
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

const tableActions = {
  delete: {
    deleteEntity: (entity: ApiTeam) => deleteTeam(entity.id),
    batchDeleteEntity: (selectedIds: string[]) => deleteTeams(selectedIds)
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

const Teams = () => {
  const teamsObservable = getTeamsAsResultObservable;
  const dataTableResult = useObservable(teamsObservable, []) ?? pendingResult;
  const [message, setMessage] = useState<Notification>();
  const entities = dataTableResult?.data as ApiTeam[];
  const pageSizes = [20, 50];

  const rows = entities?.map((team: ApiTeam) => ({
    name: (
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
    rowData: team
  }));

  const getMenuItems = (row: DataTableRow<any[]>) => {
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
        tableRows={rows ?? []}
        loading={isLoading(dataTableResult)}
        searchPlaceholderText={t('in-settings:components.search')}
        searchAttributes={['tag']}
        initalSortConfig={{ key: 'tag', direction: 'asc' }}
        onCreateNew={() => {
          addActiveDialog(<CreateTeamDialog setMessage={setMessage} />);
        }}
        labelNew={t('in-settings:tabs.newTeam')}
        getMenuItems={getMenuItems}
        getBatchActionItems={getBatchActionItems}
        getEntityName={({ tag }: ApiTeam) => t('in-settings:tabs.userWithName', { name: tag })}
        pageSizes={pageSizes}
        tableActions={tableActions}
        message={message}
      />
    </>
  );
};

export default Teams;
