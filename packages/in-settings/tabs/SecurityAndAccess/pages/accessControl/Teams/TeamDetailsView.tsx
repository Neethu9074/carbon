/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { generateUniqueShortId } from '@instana/utils';
import { ToastNotification } from '@instana/carbon';
import { Team, TeamDetails } from '@instana/types';

import TagUsedOnCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/tagUsedOnCard/TagUsedOnCard';
import MemberCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/MemberCard';
import ScopeCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/ScopeCard';
import NameCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/NameCard';
import { Notification } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { getTeam, saveTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SETTINGS_TEAM_UPDATE } from 'in-services/tracking/eventNames';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { t } from 'in-i18n';

import locals from './TeamDetailsView.mless';

const TeamDetailsView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<TeamDetails>({
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
    getTeam(teamId, true).once(
      teamData => {
        setTeam(teamData);
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
  }, [teamId]);

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
    setTeam(data);

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
      {message && <ToastNotification className={locals.toastMessage} lowContrast {...message} />}
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
            isLoading={isLoading}
            team={team}
            setTeamData={setTeamData}
            saveTeam={data => saveTeamHandler(data, refreshTeam, onError)}
          />
        </div>
        <div className={locals.column}>
          <ScopeCard isLoading={isLoading} team={team} refreshTeam={refreshTeam} saveTeam={saveTeamHandler} />
        </div>
      </div>

      <TagUsedOnCard isLoading={isLoading} entities={team.entities} />
    </div>
  );
};

export default TeamDetailsView;
