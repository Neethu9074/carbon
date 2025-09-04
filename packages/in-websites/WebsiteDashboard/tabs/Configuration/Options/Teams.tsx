/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useEffect, useCallback } from 'react';

import { Button, Message, Typography } from '@instana/components';
import { Callout } from '@instana/carbon';
import { TeamTag } from '@instana/types';

import TeamAssociationDropdown, {
  useTaggedTeamsSelection
} from 'in-settings/components/Shared/TeamAssociationDropdown/TeamAssociationDropdown';
import SaveIndicator from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/SaveIndicator';
import { updateWebsiteTeams } from 'in-websites/api/websites';
import { combineDataAndError } from 'in-services/util/ro';
import { getWebsite } from 'in-websites/api/websites';
import { t } from 'in-i18n';

import locals from './Teams.mless';

interface TeamTagEx extends TeamTag {
  tag_id?: string;
}
export interface Props {
  websiteId: string;
}

export default function WebsiteTeams({ websiteId }: Props) {
  // State for teams data
  const [teamsData, setTeamsData] = useState<TeamTagEx[]>([]);
  const [selectedList, setSelectedList] = useState<TeamTag[]>([]);
  const [saveId, setSaveId] = useState<string | undefined>(undefined);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch website data
  const fetchWebsiteData = useCallback(() => {
    setIsLoading(true);
    const subscription = combineDataAndError(getWebsite(websiteId)).once(({ data, error }) => {
      if (error) {
        handleSaveError(error);
        setIsLoading(false);
        return;
      }
      // Extract teams data from the result
      const teams = data?.rbacTags || [];
      setTeamsData(teams);
      setIsLoading(false);
      subscription.dispose();
    });
    return subscription;
  }, [websiteId]);

  // Fetch data when the component mounts or websiteId changes
  useEffect(() => {
    const subscription = fetchWebsiteData();

    // Clean up subscription when component unmounts
    return () => {
      subscription.dispose();
    };
  }, [fetchWebsiteData, websiteId, saveId]);

  // Convert teams data to the format needed by TeamAssociationDropdown
  const assignedTeamTags = teamsData.map(team => ({
    id: team.id || team.tag_id || '',
    displayName: team.displayName
  }));

  // Use the TeamAssociationDropdown hook
  const { teamsTagged, teamsSelected, teamsLoading } = useTaggedTeamsSelection(assignedTeamTags, setSelectedList);

  function handleSaveError(error: any) {
    const errorMessage = error?.toString ? error.toString() : JSON.stringify(error);
    setSaveError(errorMessage);
  }

  function handleSave() {
    updateWebsiteTeams(websiteId, selectedList).once(
      () => {
        setSaveId(String(Date.now()));
        setSaveError(undefined);

        // Refresh data from the server to get the updated teams
        fetchWebsiteData();
      },
      error => handleSaveError(error)
    );
  }

  return (
    <div>
      <h1 className={locals.title}>{t('in-websites:websiteDashboard.tabs.configuration.configurationLabelTeams')}</h1>
      <Typography variant="body-01">{t('in-websites:websiteDashboard.tabs.configuration.teamsDescription')}</Typography>
      <Callout
        className={locals.message}
        subtitle={t('in-websites:websiteDashboard.tabs.configuration.teamsCallout')}
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
        <Button onClick={handleSave} disabled={teamsLoading || isLoading} kind="primary">
          {t('in-websites:websiteDashboard.tabs.configuration.save')}
        </Button>
        <SaveIndicator id={saveId} />
        {saveError && <Message type="warning">{saveError}</Message>}
      </div>
    </div>
  );
}
