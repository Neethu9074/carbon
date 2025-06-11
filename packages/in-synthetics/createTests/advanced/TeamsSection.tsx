/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useEffect, useState } from 'react';

import { CarbonCallout, CarbonMultiSelect } from '@instana/components';
import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import { getTeamsOverview } from 'in-api/teams';
import { TeamRaw, TeamTagEx } from 'in-synthetics/utils/constants';
import { hasError, isLoading } from 'in-services/util/result';
import { rbacTeamsEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/TeamsSection.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  teams: TeamTagEx[];
  setTeams: React.Dispatch<React.SetStateAction<TeamTagEx[]>>;
}

export default function TeamsSection({ form, updateForm, teams, setTeams }: Props) {
  const [selectedList, setSelectedList] = useState<TeamRaw[]>([]);
  const teamsResult = useObservable(getTeamsOverview, []) ?? pendingResult;
  const teamsLoading = isLoading(teamsResult);
  const teamsHasErrors = hasError(teamsResult);
  const teamsList = !teamsLoading && !teamsHasErrors ? teamsResult.data : [];
  const teamsAssigned = teams;
  useEffect(() => {
    if (rbacTeamsEnabled && !teamsLoading && !teamsHasErrors) {
      const teamsSelected = teamsAssigned
        ? teamsList.filter((item: TeamRaw) =>
            teamsAssigned.some((team: TeamTagEx) => (team.tag_id || team.id) == item.id)
          )
        : [];
      setSelectedList(teamsSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamsAssigned, teamsList]);
  function updateTeamsInForm(items: TeamTagEx[]) {
    updateForm(
      form.updateIn(['rbacTags'], (field: Item) => (field as Field<TeamTagEx[]>).setValue(items).setTouched(true))
    );
  }

  const onSelectionChanged = (items: TeamRaw[]) => {
    const rbacTags: TeamTagEx[] = items.map(item => {
      return { id: item.id, displayName: item.name };
    });
    setSelectedList(items);
    setTeams(rbacTags);
    updateTeamsInForm(rbacTags);
  };
  return (
    <div className={locals.teamsContainer}>
      <CarbonCallout
        className={locals.message}
        subtitle={t('in-synthetics:dialog.createTest.advancedMode.teamsCalloutMessage')}
        lowContrast
      />
      <div id="teamsSelect" className={locals.teamsSelector}>
        <CarbonMultiSelect
          id="custDashTeamsSelect"
          size="sm"
          label={t('in-custom-dashboards:customDashboard.editTeamsDialog.chooseTeams')}
          titleText={t('in-custom-dashboards:customDashboard.editTeamsDialog.selectorLabel')}
          onChange={(data: any) => onSelectionChanged(data.selectedItems)}
          items={teamsList}
          selectedItems={selectedList}
          itemToString={(item: any) => (item ? item.name : '')}
        />
      </div>
    </div>
  );
}
