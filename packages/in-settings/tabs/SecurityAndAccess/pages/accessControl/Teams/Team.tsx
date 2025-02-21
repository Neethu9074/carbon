/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CarbonToastNotification } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import TeamNameDescription from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamNameDescription';
import TeamMember from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamMember';
import TeamTagUse from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamTagUse';
import TeamScope from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamScope';
import { Notification } from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { ApiTeam, getTeam, saveTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SETTINGS_TEAM_UPDATE } from 'in-services/tracking/eventNames';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { t } from 'in-i18n';

import locals from './Team.mless';

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

  const setNotification = (notification: Notification) => {
    setMessage({ key: generateUniqueShortId(), ...notification });
  };

  useEffect(() => {
    // Load team from URL id
    getTeam(teamId).once(
      data => {
        setTeam(data);
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
  }, [teamId]);

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
        setTeam(savedTeam.body);

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
          <TeamMember isLoading={isLoading} team={team} setTeamData={setTeamData} saveTeam={saveTeamHandler} />
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
