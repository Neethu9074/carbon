/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Typography, CarbonCallout } from '@instana/components';
import { Button, Message } from '@instana/components';
import { TeamTag } from '@instana/types';

import TeamAssociationDropdown, {
  useTaggedTeamsSelection
} from 'in-settings/components/Shared/TeamAssociationDropdown/TeamAssociationDropdown';
import SaveIndicator from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/SaveIndicator';
import { updateMobileAppTeams } from 'in-mobile-apps/api/mobileApps';
import { t } from 'in-i18n';

import locals from './Teams.mless';

interface TeamTagEx extends TeamTag {
  tag_id?: string;
}
export interface Props {
  mobileAppId: string;
  data: { id: string; rbacTags: TeamTagEx[] };
}

export default function MobileAppTeams({ mobileAppId, data }: Props) {
  const [selectedList, setSelectedList] = useState<TeamTag[]>([]);
  const [state, setState] = useState<{ isSaving: boolean; saveId?: string; saveError?: any }>({
    isSaving: false
  });
  const teamsAssigned = data?.rbacTags;
  const assignedTeamTags = teamsAssigned.map(team => ({
    id: team.id || team.tag_id || '',
    displayName: team.displayName
  }));
  const { teamsTagged, teamsSelected, teamsLoading } = useTaggedTeamsSelection(assignedTeamTags, setSelectedList);

  function handleSaveError(error: any) {
    const errorMessage = error?.toString ? error.toString() : JSON.stringify(error);
    setState({
      isSaving: false,
      saveId: undefined,
      saveError: errorMessage
    });
  }

  function handleSave() {
    setState({
      ...state,
      isSaving: true,
      saveError: undefined,
      saveId: undefined
    });

    updateMobileAppTeams(mobileAppId, selectedList).once(
      () => {
        setState({
          isSaving: false,
          saveId: String(Date.now()),
          saveError: undefined
        });
      },
      error => handleSaveError(error)
    );
  }

  return (
    <div>
      <h1 className={locals.title}>{t('in-mobile-apps:dashboard.tabs.configurations.configurationLabelTeams')}</h1>
      <Typography variant="body-01">{t('in-mobile-apps:dashboard.tabs.configurations.teamsDescription')}</Typography>
      <CarbonCallout
        className={locals.message}
        subtitle={t('in-mobile-apps:dashboard.tabs.configurations.teamsCallout')}
        lowContrast
      />
      <div className={locals.dropdownRow}>
        <div className={locals.teamsSelector}>
          <TeamAssociationDropdown
            onTeamsSelectionChanged={setSelectedList}
            assignedTeamTags={teamsSelected || []}
            teamsTagged={teamsTagged || []}
          />
        </div>
        <Button onClick={handleSave} disabled={teamsLoading || state.isSaving} kind="primary">
          {t('in-mobile-apps:dashboard.tabs.configurations.save')}
        </Button>
        <SaveIndicator id={state.saveId} />
        {state.saveError && <Message type="warning">{state.saveError}</Message>}
      </div>
    </div>
  );
}
