/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CarbonToastNotification } from '@instana/components';
import { RoleOverview, UserResult } from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { createLogger } from '@instana/logger';

import {
  ApiTeam as Team,
  ApiTeamRole as TeamRole,
  ApiTeamMember as TeamMember,
  getTeam,
  saveTeam
} from 'in-settings/tabs/SecurityAndAccess/api/teams';
import TagUsedOnCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/tagUsedOnCard/TagUsedOnCard';
import { MOCK_TEAM } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/Team.mocks';
//@ts-expect-error not migrated to typescript
import Header from 'in-settings/components/ApiItemView/Header';
import MemberCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/MemberCard';
import ScopeCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/ScopeCard';
import NameCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/NameCard';
import { Notification } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import useRolesOverview from 'in-settings/tabs/SecurityAndAccess/hooks/useRolesOverview';
import { securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SETTINGS_TEAM_UPDATE } from 'in-services/tracking/eventNames';
import { isLoading as isResultLoading } from 'in-services/util/result';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { pendingResult } from 'in-services/fixedObjects';
import { getUsersResult } from 'in-api/users';
import { t } from 'in-i18n';

import locals from './TeamDetails.mless';

const logger = createLogger('TeamDetails');

/* Temporary low quality function to add user name and role name to team data,
 * to be removed when user name and role name are available through API */
const enrichTeam = (team: Team, users: Array<UserResult>, roles: Array<RoleOverview> | undefined) => {
  logger.warn('Temporary function to be removed when user name and role name are available through team API');
  let newMembers: TeamMember[] = [];
  if (team?.members) {
    newMembers = team.members.map(member => {
      let fullName = '';
      let newRoleIds: TeamRole[] = [];
      if (users?.length > 0) {
        const user = users.find(user => user.id === member.userId);
        if (user) {
          fullName = user?.fullName;
        }
      }

      if (roles && roles?.length > 0 && member?.roleIds) {
        newRoleIds = member.roleIds.map(roleId => {
          let roleName = '';
          const role = roles.find(role => role.id === roleId.roleId);
          if (role) {
            roleName = role.name;
          }

          return {
            roleId: roleId.roleId,
            roleName: roleName,
            viaIdP: roleId.viaIdP
          };
        });
      }

      return {
        ...member,
        fullName: fullName,
        roleIds: newRoleIds
      };
    });
  }

  return {
    ...team,
    members: newMembers
  };
};

const TeamDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<Team>({
    id: '',
    tag: '',
    info: {
      description: ''
    },
    members: [],
    scope: {},
    teamTagUsed: { alertChannels: 0, customDashboards: 0 }
  });
  const [message, setMessage] = useState<Notification>();
  const { unstable_trackEvent } = useSegmentTracking();
  const { id: teamId } = useParams<{ id: string }>();

  // Will no longer be needed once user name and role name are available through API
  const usersResult = useObservable(getUsersResult, []) ?? pendingResult;
  const [rolesData, , , rolesProgress] = useRolesOverview();

  const setNotification = (notification: Notification) => {
    setMessage({ key: generateUniqueShortId(), ...notification });
  };

  useEffect(() => {
    // Load team from URL id
    getTeam(teamId).once(
      teamData => {
        //setTeam(teamData);
        setTeam(
          enrichTeam(
            teamData,
            isResultLoading(usersResult) ? [] : usersResult.data,
            rolesProgress?.loading ? [] : rolesData
          )
        );
        setIsLoading(false);
      },
      error => {
        setNotification({
          kind: 'error',
          title: t('in-settings:tabs.teams.failedToLoadTeam'),
          subtitle: error.message
        });
      }
    );
  }, [teamId, rolesData, usersResult, rolesProgress]);

  const setTeamData = ({ tag = '', info = undefined, members = undefined }: Partial<Team>) => {
    setTeam(previous => {
      return {
        ...previous,
        ...(tag !== '' ? { tag } : {}),
        ...(info !== undefined ? { info: { ...previous?.info, description: info?.description } } : {}),
        ...(members !== undefined ? { members } : {})
      };
    });
  };

  const refreshTeam = (data: Team) => {
    //setTeam(data);
    setTeam(
      enrichTeam(data, isResultLoading(usersResult) ? [] : usersResult.data, rolesProgress?.loading ? [] : rolesData)
    );

    // Track team update via Segment
    const customData = {
      id: data?.id
    };
    unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_TEAM_UPDATE }, customData);
  };

  const onError = (message: string) => {
    setNotification({
      kind: 'error',
      title: t('in-settings:tabs.teams.failedToSaveTeam'),
      subtitle: message
    });
  };

  // Update team
  const saveTeamHandler = (data: Team, onSuccess: (data: Team) => void, onError: (message: string) => void) => {
    saveTeam(data).once(
      () => {
        onSuccess(data);
      },
      error => {
        onError(error.message);
      }
    );
  };

  return (
    <div>
      <Header
        parentPath={securityAndAccessAccessControlTeams}
        parentViewName={t('in-settings:tabs.teams.teamsTitle')}
      />
      {message && <CarbonToastNotification className={locals.toastMessage} lowContrast {...message} />}
      <NameCard
        isLoading={isLoading}
        team={team}
        setMessage={setNotification}
        setTeamData={setTeamData}
        saveTeam={data => saveTeamHandler(data, refreshTeam, onError)}
      />

      <div className={locals.row}>
        <div className={locals.column}>
          <MemberCard
            isLoading={
              isLoading ||
              team?.members.some(
                m =>
                  m?.fullName === undefined ||
                  m?.fullName === '' ||
                  m?.roleIds?.some(r => r?.roleName === undefined || r?.roleName === '')
              )
            }
            team={team}
            setTeamData={setTeamData}
            saveTeam={data => saveTeamHandler(data, refreshTeam, onError)}
          />
        </div>
        <div className={locals.column}>
          <ScopeCard isLoading={isLoading} team={team} refreshTeam={refreshTeam} saveTeam={saveTeamHandler} />
        </div>
      </div>

      <TagUsedOnCard isLoading={isLoading} teamTagUsed={MOCK_TEAM.teamTagUsed} />
    </div>
  );
};

export default TeamDetails;
