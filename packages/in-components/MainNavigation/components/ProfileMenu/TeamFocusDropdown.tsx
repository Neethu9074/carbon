/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { CarbonDropdown as Dropdown } from '@instana/components';
import { TeamTag } from '@instana/types';
import { t } from '@instana/i18n-react';

import { deleteTeamFocus, updateTeamFocus } from 'in-api/teams';

interface TeamFocusDropdownProps {
  teams: TeamTag[];
}

export default function TeamFocusDropdown(props: TeamFocusDropdownProps) {
  const { teams } = props;
  const defaultOption = { displayName: t('in-components:mainNavigation.teamFocus_entireUnit'), id: '' };

  const teamsOptions = [...teams, defaultOption];
  // @ts-expect-error
  const teamId = window.instana.user?.role?.teamId;
  const [selectedTeamFocus, setSelectedTeamFocus] = useState<TeamTag>(
    teamId ? (teams.find(team => team.id === teamId) as TeamTag) : defaultOption
  );
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
    <Dropdown
      id="team-focus-selection"
      initialSelectedItem={selectedTeamFocus}
      itemToString={item => item?.displayName ?? ''}
      items={teamsOptions}
      label={selectedTeamFocus}
      titleText={t('in-components:mainNavigation.teamFocus_title')}
      type="default"
      onChange={({ selectedItem }) => onChangeTeamFocus(selectedItem as TeamTag)}
    />
  );
}
