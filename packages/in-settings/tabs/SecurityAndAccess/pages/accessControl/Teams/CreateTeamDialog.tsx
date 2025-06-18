/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { TeamDetails } from '@instana/types';
import { Modal } from '@instana/carbon';

import NameForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/name/NameForm';
import { getEntityHref, securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { Notification } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { saveTeam } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { SETTINGS_TEAM_CREATE } from 'in-services/tracking/eventNames';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { close } from 'in-components/DialogPresenter/store';
import { CREATED_OBJECT } from 'in-services/util/constants';
import { t } from 'in-i18n';

interface CreateTeamDialogProps {
  setMessage: React.Dispatch<React.SetStateAction<Notification | undefined>>;
}

const CreateTeamDialog = ({ setMessage }: CreateTeamDialogProps) => {
  const [isValid, setValid] = useState(false);
  const { unstable_trackEvent } = useSegmentTracking();
  const { navigate } = useNavigation();
  const [team, setTeam] = useState<TeamDetails>({
    id: '',
    tag: '',
    info: {
      description: ''
    },
    members: [],
    scope: {}
  });

  const setTeamData = ({ tag, info }: Partial<TeamDetails>) => {
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
        const teamId = savedTeam?.body?.id;
        setMessage({
          kind: 'success',
          title: t('in-settings:components.successTitle'),
          subtitle: t('in-settings:tabs.teams.teamSuccessfullySaved'),
          timeout: 3000
        });

        // Track team creation via Segment
        const customData = {
          id: teamId
        };
        unstable_trackEvent(CREATED_OBJECT, { objectType: SETTINGS_TEAM_CREATE }, customData);
        navigate(parseUrl(getEntityHref(securityAndAccessAccessControlTeams, teamId ?? ''), true));
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
    <Modal
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
        description={team.info?.description}
        editable
        name={team.tag}
        setTeamData={setTeamData}
        setValid={setValid}
      />
    </Modal>
  );
};

export default CreateTeamDialog;
