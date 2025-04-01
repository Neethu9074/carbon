/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CarbonInlineLoading } from '@instana/components';

import TeamNameDescriptionCard from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamNameDescriptionCard';
import TeamForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamForm';
import { Notification } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { ApiTeam as Team, deleteTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

interface TeamNameDescriptionProps {
  isLoading: boolean;
  team: Team;
  setMessage: (message: Notification) => void;
  setTeamData: (team: Partial<Team>) => void;
  saveTeam: (data: Team) => void;
}

const TeamNameDescription = ({ isLoading, team, setMessage, setTeamData, saveTeam }: TeamNameDescriptionProps) => {
  const [editTeam, setEditTeam] = useState<Team>(team);
  const [isValid, setIsValid] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const { goToPath } = useNavigation();

  const deleteTeamHandler = () => {
    // Close confirmation dialog
    close();

    if (team?.id) {
      deleteTeam(team.id).once(
        () => {
          goToPath(`${securityAndAccessAccessControlTeams}`);
        },
        error => {
          setMessage({
            kind: 'error',
            title: t('in-settings:components.failedToRemoveItem'),
            subtitle: `(${team.id}): ${error.message}`
          });
        }
      );
    }
  };

  const saveNameDescriptionHandler = () => {
    // Save name/description edit
    setTeamData({
      tag: editTeam?.tag,
      info: { description: editTeam?.info?.description }
    });
    saveTeam({
      ...team,
      tag: editTeam?.tag,
      info: { ...team?.info, description: editTeam?.info?.description }
    });
    setIsEditMode(previous => !previous);
  };

  const cancelEditHandler = () => {
    // Cancel name/description edit
    setTeamData({
      tag: team?.tag,
      info: { description: team?.info?.description }
    });
    setEditTeam({ ...team });
    setIsEditMode(previous => !previous);
  };

  const setNameDescription = ({ tag, info }: Partial<Team>) => {
    setEditTeam(previous => {
      return {
        ...previous,
        tag: tag as string,
        info: { ...previous?.info, description: info?.description as string }
      };
    });
  };

  return (
    <TeamNameDescriptionCard
      cancelHandler={cancelEditHandler}
      deleteHandler={deleteTeamHandler}
      editHandler={() => {
        setEditTeam({ ...team });
        setIsEditMode(previous => !previous);
      }}
      isEditMode={isEditMode}
      isValid={isValid}
      saveHandler={saveNameDescriptionHandler}
      teamName={team?.tag}
      title={t('in-settings:tabs.teams.teamNameAndDescription')}
    >
      {isLoading && <CarbonInlineLoading />}
      {!isLoading && (
        <TeamForm
          description={isEditMode ? editTeam?.info?.description : team?.info?.description}
          editable={isEditMode}
          name={isEditMode ? editTeam?.tag : team?.tag}
          setTeamData={setNameDescription}
          setValid={setIsValid}
          {...(isEditMode ? { originalName: team.tag } : {})}
        />
      )}
    </TeamNameDescriptionCard>
  );
};

export default TeamNameDescription;
