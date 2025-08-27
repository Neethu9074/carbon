/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MultiSelect, InlineNotification, InlineLoading } from '@instana/carbon';
import { AutoReposition } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TeamOverview } from '@instana/types';

import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { RbacTags } from 'in-bizops/utils/types';
import { getTeamsOverview } from 'in-api/teams';
import { t } from 'in-i18n';

interface TeamsSelectionProps {
  onChange: (teams: RbacTags[] | undefined) => void;
  selectedTeams: RbacTags[];
  id?: string;
  color?: string;
  overflowAlign?: OverflowAlign;
}

type OverflowAlign =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-bottom'
  | 'left-top'
  | 'right'
  | 'right-bottom'
  | 'right-top';

export function TeamsSelection({ onChange, selectedTeams = [], id = 'teamsMultiSelect' }: TeamsSelectionProps) {
  // Fetch the teams data and have variables for the loading and errors states
  const teamsListResult = useObservable(getTeamsOverview, []) ?? pendingResult;
  const loading = isLoading(teamsListResult);
  const hasErrors = hasError(teamsListResult);
  return (
    <div>
      {loading && !hasErrors ? (
        <InlineLoading />
      ) : (
        <AutoReposition>
          <MultiSelect
            id={id}
            itemToString={(e: TeamOverview) => {
              return e.name;
            }}
            onChange={e => {
              const selectedTeamsChange =
                e &&
                e.selectedItems?.map((selected: TeamOverview) => {
                  return { id: selected.id, displayName: selected.name };
                });
              onChange(selectedTeamsChange);
            }}
            items={teamsListResult.data}
            initialSelectedItems={getInitialSelectedTeams(teamsListResult.data, selectedTeams)}
            label={t('in-bizops:perspectives.dialog.stepTwo.selectTeams')}
            size="md"
            titleText={t('in-bizops:perspectives.dialog.stepTwo.teams')}
          />
        </AutoReposition>
      )}
      {hasErrors && (
        <InlineNotification
          lowContrast
          kind="error"
          title={t('in-bizops:perspectives.dialog.stepTwo.failedToLoad')}
          statusIconDescription={t('in-bizops:perspectives.dialog.stepTwo.information')}
          subtitle={teamsListResult.errors[0].message}
        />
      )}
    </div>
  );
}

// Simple filter function that will help set selected teams
const getInitialSelectedTeams = (allTeams: TeamOverview[], selectedTeams: RbacTags[]) => {
  if (!allTeams) return [];

  // Filter teams that match the selected team IDs
  return allTeams.filter((team: TeamOverview) => selectedTeams.some(selectedTeam => selectedTeam.id === team.id));
};
