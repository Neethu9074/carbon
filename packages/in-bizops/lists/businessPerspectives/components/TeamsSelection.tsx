/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MultiSelect, InlineNotification, InlineLoading } from '@instana/carbon';
import { AutoReposition } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TagSet } from '@instana/ibm-products';
import { TeamOverview } from '@instana/types';

import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { getTeamsOverview } from 'in-api/teams';
import { t } from 'in-i18n';

import locals from 'in-bizops/lists/businessPerspectives/components/TeamsSelection.mless';

interface TeamsSelectionProps {
  onChange: (teams: string[] | undefined) => void;
  selectedTeams: string[];
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

export function TeamsSelection({
  onChange,
  selectedTeams,
  id = 'teamsMultiSelect',
  color = 'high-contrast',
  overflowAlign = 'bottom'
}: TeamsSelectionProps) {
  // Fetch the teams data and have variables for the loading and errors states
  const teamsListResult = useObservable(getTeamsOverview, []) ?? pendingResult;
  const loading = isLoading(teamsListResult);
  const hasErrors = hasError(teamsListResult);
  const tagSet = selectedTeams.map((tagName: string) => {
    return {
      label: tagName,
      type: color,
      onClose: () => {
        handleIndividualTeamRemoval(tagName, selectedTeams, onChange);
      }
    };
  });

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
                  return selected.name;
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

      <div className={locals.teamsBadgeWrapper}>
        <TagSet tags={tagSet} align="start" overflowAlign={overflowAlign} />
      </div>
    </div>
  );
}

// Function to handle the removal of a single team entry when clicking on the tag itself
const handleIndividualTeamRemoval = (tagName: string, selectedTeams: string[], onChange: Function) => {
  const finalSelectedTeams = selectedTeams;
  var index = finalSelectedTeams.indexOf(tagName);
  if (index !== -1) {
    finalSelectedTeams.splice(index, 1);
  }
  onChange(finalSelectedTeams);
};

// Simple filter function that will help set selected teams
const getInitialSelectedTeams = (allTeams: any, selectedTeams: string[]) => {
  const initial = (allTeams && allTeams.filter((team: { name: string }) => selectedTeams.includes(team.name))) || [];
  return initial;
};
