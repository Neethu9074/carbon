/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Modal, Callout } from '@instana/carbon';
import { Typography } from '@instana/components';

import TeamAssociationDropdown, {
  useTaggedTeamsSelection
} from 'in-settings/components/Shared/TeamAssociationDropdown/TeamAssociationDropdown';
import { CustomDashboardWithUserSpecificInformation, TeamTag } from 'in-types';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './EditTeamsDialog.mless';

interface TeamTagEx {
  tag_id?: string;
  id?: string;
  entity_id: string;
  displayName: string;
}
interface customDashboardConfig extends CustomDashboardWithUserSpecificInformation {
  rbacTags: TeamTagEx[];
}
interface EditTeamsProps {
  config: customDashboardConfig;
  onSubmit: Function;
}

export default function EditTeamsDialog({ config, onSubmit }: EditTeamsProps) {
  const [selectedList, setSelectedList] = useState<TeamTag[]>([]);
  const teamsAssigned = config?.rbacTags;
  const assignedTeamTags = teamsAssigned.map(team => ({
    id: team.tag_id ?? '',
    displayName: team.displayName
  }));
  const { teamsTagged, teamsLoading, teamsError, teamsSelected } = useTaggedTeamsSelection(
    assignedTeamTags,
    setSelectedList
  );

  const handleSubmit = () => {
    const newConfig = { ...config, rbacTags: selectedList };
    onSubmit({
      ...newConfig
    });
    close();
  };

  return (
    <Modal
      open
      onRequestClose={close}
      modalHeading={t('in-custom-dashboards:customDashboard.editTeamsDialog.title')}
      primaryButtonText={t('in-custom-dashboards:save')}
      primaryButtonDisabled={false}
      secondaryButtonText={t('in-custom-dashboards:cancel')}
      size="md"
      onRequestSubmit={() => handleSubmit()}
    >
      <Typography variant="body-01">{t('in-custom-dashboards:customDashboard.editTeamsDialog.description')}</Typography>
      <Callout
        className={locals.message}
        subtitle={t('in-custom-dashboards:customDashboard.editTeamsDialog.calloutMessage')}
        lowContrast
      />
      {!teamsLoading && !teamsError && (
        <div id="teamsSelect" className={locals.teamsSelector}>
          <TeamAssociationDropdown
            assignedTeamTags={teamsSelected}
            teamsTagged={teamsTagged}
            onTeamsSelectionChanged={setSelectedList}
          />
        </div>
      )}
    </Modal>
  );
}
