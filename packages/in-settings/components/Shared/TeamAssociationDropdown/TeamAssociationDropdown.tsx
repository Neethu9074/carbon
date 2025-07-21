/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { MultiSelect } from '@instana/carbon';
import { TeamTag } from '@instana/types';

import { getTagsResult } from 'in-settings/tabs/SecurityAndAccess/api/tags';
import { isLoading, hasError } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface TeamAssociationDropdownProps {
  assignedTeamTags: TeamTag[];
  onTeamsSelectionChanged: (item: TeamTag[]) => void;
  teamsTagged: TeamTag[];
}

interface TaggedTeamsSelectionResult {
  teamsTagged: TeamTag[];
  teamsSelected: TeamTag[];
  teamsLoading: boolean;
  teamsError: boolean;
}

export function useTaggedTeamsSelection(
  assignedTeamTags: TeamTag[],
  onTeamsSelectionChanged: (item: TeamTag[]) => void
): TaggedTeamsSelectionResult {
  const dataResult = useObservable(getTagsResult, []) ?? pendingResult;
  const teamsLoading = isLoading(dataResult);
  const teamsError = hasError(dataResult);
  const teamsList: TeamTag[] = dataResult.data ?? [];
  const [teamsTagged, setTeamsTagged] = useState<TeamTag[]>([]);

  const isTeamsAssigned = assignedTeamTags?.length > 0;
  const initialTeamSelected = teamsList?.filter(team => team.id === window.instana?.user?.role?.teamId);
  const teamsSelected = isTeamsAssigned ? assignedTeamTags : initialTeamSelected;
  useEffect(() => {
    if (!teamsLoading && !teamsError) {
      const teamsTaggedList = [...assignedTeamTags, ...teamsList];
      const uniqueTeamsTagged = teamsTaggedList.filter(
        (team, index, self) => index === self.findIndex(t => t.id === team.id)
      );
      onTeamsSelectionChanged(teamsSelected);
      setTeamsTagged(isTeamsAssigned ? uniqueTeamsTagged : teamsList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamsList]);

  return {
    teamsTagged,
    teamsSelected,
    teamsLoading,
    teamsError
  };
}

export default function TeamAssociationDropdown({
  teamsTagged,
  assignedTeamTags,
  onTeamsSelectionChanged
}: TeamAssociationDropdownProps) {
  const onSelectionChanged = (item: TeamTag[]) => {
    onTeamsSelectionChanged(item);
  };
  return (
    <MultiSelect
      id="teams-select-dropdown"
      label={t('in-settings:tabs.chooseTeams')}
      titleText={t('in-settings:tabs.accessTitle')}
      onChange={data => onSelectionChanged(data.selectedItems ?? [])}
      items={teamsTagged}
      initialSelectedItems={assignedTeamTags}
      itemToString={item => (item ? item.displayName : '')}
    />
  );
}
