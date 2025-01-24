/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CarbonModal } from '@instana/components';

import TeamForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamForm';
import { Notification } from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { ApiTeam, saveTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SETTINGS_TEAM_CREATE } from 'in-services/tracking/eventNames';
import { CREATED_OBJECT } from 'in-services/util/constants';
import { t } from 'in-i18n';

interface CreateTeamDialogProps {
  setMessage: (message: Notification) => void;
}

const CreateTeamDialog = ({ setMessage }: CreateTeamDialogProps) => {
  const [showModel, setShowModel] = useState(true);
  const [isValid, setValid] = useState(false);
  const { unstable_trackEvent } = useSegmentTracking();
  const [team, setTeam] = useState({
    id: '',
    tag: '',
    info: {
      description: ''
    },
    members: [],
    scope: {}
  });

  const setTeamData = ({ tag, info }: Partial<ApiTeam>) => {
    setTeam(previous => {
      return {
        ...previous,
        tag: tag as string,
        info: { ...previous.info, description: info?.description as string }
      };
    });
  };

  // Save new team
  const save = () => {
    saveTeam(team).once(
      savedTeam => {
        setMessage({
          kind: 'success',
          title: t('in-settings:tabs.teams.teamSuccessfullySaved'),
          timeout: 3000
        });

        // Track team creation via Segment
        const customData = {
          id: savedTeam.body.id
        };
        unstable_trackEvent(CREATED_OBJECT, { objectType: SETTINGS_TEAM_CREATE }, customData);
      },
      error => {
        setMessage({
          kind: 'error',
          title: t('in-settings:tabs.teams.failedToSaveTeam'),
          subtitle: error.message
        });
      }
    );
  };

  return (
    <CarbonModal
      size="sm"
      open={showModel}
      modalHeading={t('in-settings:tabs.teams.createTeamDialogTitle')}
      primaryButtonDisabled={!isValid}
      primaryButtonText={t('in-settings:tabs.save')}
      secondaryButtonText={t('in-settings:tabs.cancel')}
      onRequestSubmit={() => {
        save();
        setShowModel(false);
      }}
      onSecondarySubmit={() => {
        setShowModel(false);
      }}
      onRequestClose={() => {
        setShowModel(false);
      }}
    >
      <TeamForm
        editable
        name={team.tag}
        description={team.info.description}
        setValid={setValid}
        setTeamData={setTeamData}
      />
    </CarbonModal>
  );
};

export default CreateTeamDialog;
