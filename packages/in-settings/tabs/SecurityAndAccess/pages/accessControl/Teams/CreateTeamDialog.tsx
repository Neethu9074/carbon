/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CarbonModal } from '@instana/components';

import TeamForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/TeamForm';
import { Notification } from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { saveTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
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

  const setTeamData = (name: string, description: string) => {
    setTeam(previous => {
      return {
        ...previous,
        tag: name,
        info: { ...previous.info, description: description }
      };
    });
  };

  // Save new team
  const save = () => {
    saveTeam(team).once(
      savedTeam => {
        setMessage({
          kind: 'success',
          title: t('in-settings:createTeamDialog.teamSuccessfullySaved'),
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
          title: t('in-settings:createTeamDialog.failedToSaveTeam'),
          subtitle: error.message,
          timeout: 10000
        });
      }
    );
  };

  return (
    <CarbonModal
      size="sm"
      open={showModel}
      modalHeading={t('in-settings:createTeamDialog.title')}
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
