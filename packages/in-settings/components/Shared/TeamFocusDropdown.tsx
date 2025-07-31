/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import { Dropdown, Layer } from '@instana/carbon';
import { TeamTag } from '@instana/types';
import { t } from '@instana/i18n-react';

import { deleteTeamFocus, updateTeamFocus } from 'in-api/teams';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';

const DEFAULT_DROPDOWN_ITEM = Object.freeze({
  displayName: t('in-components:mainNavigation.scope_defaultScope'),
  id: ''
} as const);

function getSelectedDropdownItem(teamId: string, teams: TeamTag[]) {
  return teamId ? (teams.find(team => team.id === teamId) as TeamTag) : DEFAULT_DROPDOWN_ITEM;
}

interface TeamFocusDropdownProps {
  teams: TeamTag[];
}

export default function TeamFocusDropdown(props: TeamFocusDropdownProps) {
  const [{ teamId }] = useCurrentUserRole();
  const { teams } = props;

  const teamsOptions = [...teams, DEFAULT_DROPDOWN_ITEM];
  const [selectedTeamFocus, setSelectedTeamFocus] = useState<TeamTag>(getSelectedDropdownItem(teamId, teams));

  useEffect(() => {
    const newSelectedTeamFocus = getSelectedDropdownItem(teamId, teams);
    setSelectedTeamFocus(newSelectedTeamFocus);
  }, [teamId, teams]);

  const onChangeTeamFocus = (selectedItem: TeamTag) => {
    setSelectedTeamFocus(selectedItem);
    if (selectedItem.id === '') {
      deleteTeamFocus().once(() => {
        window.location.reload();
      });
    } else {
      updateTeamFocus(selectedItem.id).once(() => {
        window.location.reload();
      });
    }
  };

  return (
    <Layer level={1}>
      <Dropdown
        id="scope-selection"
        initialSelectedItem={selectedTeamFocus}
        selectedItem={selectedTeamFocus}
        itemToString={item => item?.displayName ?? ''}
        items={teamsOptions}
        label={selectedTeamFocus?.displayName}
        titleText={t('in-components:mainNavigation.scope_title')}
        type="default"
        onChange={({ selectedItem }) => onChangeTeamFocus(selectedItem as TeamTag)}
        size="sm"
      />
    </Layer>
  );
}
