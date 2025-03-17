/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CarbonToastNotification } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { createLogger } from '@instana/logger';
import { UserResult } from '@instana/types';

import TeamNameDescription from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamNameDescription';
//@ts-expect-error not migrated to typescript
import Header from 'in-settings/components/ApiItemView/Header';
import TeamMember from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamMember';
import TeamTagUse from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamTagUse';
import TeamScope from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamScope';
import { ApiTeam, ApiTeamRole, getTeam, saveTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { Notification } from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import useRolesOverview from 'in-settings/tabs/SecurityAndAccess/hooks/useRolesOverview';
import { securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { Role } from 'in-settings/tabs/SecurityAndAccess/api/rolesMocks';
import { SETTINGS_TEAM_UPDATE } from 'in-services/tracking/eventNames';
import { isLoading as isResultLoading } from 'in-services/util/result';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { pendingResult } from 'in-services/fixedObjects';
import { getUsersResult } from 'in-api/users';
import { t } from 'in-i18n';

import locals from './Team.mless';

const logger = createLogger('TeamDetails');

/* Temporary low quality function to add user name and role name to team data,
 * to be removed when user name and role name are available through API */
const enrichTeam = (team: ApiTeam, users: Array<UserResult>, roles: Array<Role>) => {
  logger.warn('Temporary function to be removed when user name and role name are available through team API');
  const newMembers = team.members.map(member => {
    let fullName = '';
    let newRoleIds: ApiTeamRole[] = [];
    if (users?.length > 0) {
      const user = users.find(user => user.id === member.userId);
      if (user) {
        fullName = user?.fullName;
      }
    }

    if (roles?.length > 0) {
      newRoleIds = member.roleIds.map(roleId => {
        let roleName = '';
        const role = roles.find(role => role.id === roleId.roleId);
        if (role) {
          roleName = role.name;
        }

        return {
          roleId: roleId.roleId,
          roleName: roleName
        };
      });
    }

    return {
      ...member,
      fullName: fullName,
      roleIds: newRoleIds
    };
  });
  return {
    ...team,
    members: newMembers
  };
};

const Team = () => {
  const [isLoading, setLoading] = useState(true);
  const [team, setTeam] = useState<ApiTeam>({
    id: '',
    tag: '',
    info: {
      description: ''
    },
    members: [],
    scope: {}
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
          //@ts-expect-error user API types have not been fixed yet, enrichTeam is only temporarily
          enrichTeam(teamData, isResultLoading(usersResult) ? [] : usersResult, rolesProgress?.loading ? [] : rolesData)
        );
        setLoading(false);
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

  const setTeamData = ({ tag = '', info = undefined, members = undefined }: Partial<ApiTeam>) => {
    setTeam(previous => {
      return {
        ...previous,
        ...(tag !== '' ? { tag } : {}),
        ...(info !== undefined ? { info: { ...previous?.info, description: info?.description } } : {}),
        ...(members !== undefined ? { members } : {})
      };
    });
  };

  // Update team
  const saveTeamHandler = (data: ApiTeam) => {
    saveTeam(data).once(
      savedTeam => {
        //setTeam(savedTeam.body);
        setTeam(
          enrichTeam(
            savedTeam.body,
            //@ts-expect-error user API types have not been fixed yet, enrichTeam is only temporarily
            isResultLoading(usersResult) ? [] : usersResult,
            rolesProgress?.loading ? [] : rolesData
          )
        );

        // Track team update via Segment
        const customData = {
          id: savedTeam.body.id
        };
        unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_TEAM_UPDATE }, customData);
      },
      error => {
        setNotification({
          kind: 'error',
          title: t('in-settings:tabs.teams.failedToSaveTeam'),
          subtitle: error.message
        });
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
      <TeamNameDescription
        isLoading={isLoading}
        team={team}
        setMessage={setNotification}
        setTeamData={setTeamData}
        saveTeam={saveTeamHandler}
      />

      <div className={locals.row}>
        <div className={locals.column}>
          <TeamMember
            isLoading={
              isLoading ||
              team?.members.some(
                m =>
                  m?.fullName === undefined ||
                  m?.fullName === '' ||
                  m.roleIds.some(r => r?.roleName === undefined || r?.roleName === '')
              )
            }
            team={team}
            setTeamData={setTeamData}
            saveTeam={saveTeamHandler}
          />
        </div>
        <div className={locals.column}>
          <TeamScope isLoading={isLoading} />
        </div>
      </div>

      <TeamTagUse isLoading={isLoading} />
    </div>
  );
};

export default Team;
