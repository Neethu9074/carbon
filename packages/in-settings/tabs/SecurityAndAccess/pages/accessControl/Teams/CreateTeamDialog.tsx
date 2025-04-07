/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CarbonModal } from '@instana/components';

import NameForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/name/NameForm';
import { Notification } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { ApiTeam as Team, saveTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SETTINGS_TEAM_CREATE } from 'in-services/tracking/eventNames';
import { close } from 'in-components/DialogPresenter/store';
import { CREATED_OBJECT } from 'in-services/util/constants';
import { t } from 'in-i18n';

interface CreateTeamDialogProps {
  setMessage: React.Dispatch<React.SetStateAction<Notification | undefined>>;
}

const CreateTeamDialog = ({ setMessage }: CreateTeamDialogProps) => {
  const [isValid, setValid] = useState(false);
  const { unstable_trackEvent } = useSegmentTracking();
  const [team, setTeam] = useState({
    id: '',
    tag: '',
    info: {
      description: ''
    },
    members: [],
    scope: {},
    teamTagUsed: { alertChannels: 0, customDashboards: 0 }
  });

  const setTeamData = ({ tag, info }: Partial<Team>) => {
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

        // Close dialog after successful save
        close();
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
      modalHeading={t('in-settings:tabs.teams.createTeamDialogTitle')}
      onRequestClose={close}
      onRequestSubmit={save}
      onSecondarySubmit={close}
      open
      primaryButtonDisabled={!isValid}
      primaryButtonText={t('in-settings:tabs.save')}
      secondaryButtonText={t('in-settings:tabs.cancel')}
      size="sm"
    >
      <NameForm
        description={team.info.description}
        editable
        name={team.tag}
        setTeamData={setTeamData}
        setValid={setValid}
      />
    </CarbonModal>
  );
};

export default CreateTeamDialog;
