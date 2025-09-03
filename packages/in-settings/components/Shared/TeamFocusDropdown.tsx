/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useRef, useState } from 'react';

import { Dropdown, Layer } from '@instana/carbon';
import { TeamTag } from '@instana/types';
import { t } from '@instana/i18n-react';

import { triggerCacheInvalidation } from 'in-services/util/memoizingObservableGenerator';
import { useGlobalLoadingIndicator } from 'in-hooks/useGlobalLoadingIndicator';
import { deleteTeamFocus, updateTeamFocus } from 'in-api/teams';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { refreshConnection } from 'in-connection/connection';
import { fetchUserInfo } from 'in-settings/api/userProfile';
import { isLoading } from 'in-services/util/result';
import { Role } from 'in-types';

// Amount of milliseconds that will pass until we hide the loading indicator
// after reconnecting.
const HIDE_LOADING_INDICATOR_DELAY = 1000;

const DEFAULT_DROPDOWN_ITEM = Object.freeze({
  displayName: t('in-components:mainNavigation.scope_defaultScope'),
  id: ''
} as const);

function getSelectedDropdownItem(teamId: string, teams: TeamTag[]): TeamTag {
  return teamId ? (teams.find(team => team.id === teamId) as TeamTag) : DEFAULT_DROPDOWN_ITEM;
}

function fetchCurrentRole(callback: (role: Role) => void): void {
  fetchUserInfo()
    .filter(result => !isLoading(result))
    .once(({ data }) => data && callback(data.role));
}

function useLoadingIndicator(): [VoidFunction, VoidFunction] {
  const timeoutRef = useRef<number>();
  const [, setGlobalLoading] = useGlobalLoadingIndicator();

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [
    function show() {
      setGlobalLoading(true);
    },
    function hide() {
      // A little hack to conceal content shifts: Wait a short amount of time to
      // make sure most of components in tree have been updated before we hide
      // the GlobalLoadingIndicator.
      timeoutRef.current = window.setTimeout(() => setGlobalLoading(false), HIDE_LOADING_INDICATOR_DELAY);
    }
  ];
}

interface TeamFocusDropdownProps {
  teams: TeamTag[];
}

export default function TeamFocusDropdown(props: TeamFocusDropdownProps) {
  const [showLoadingIndicator, hideLoadingIndicator] = useLoadingIndicator();
  const [{ teamId }, updateCurrentUserRole] = useCurrentUserRole();
  const { teams } = props;

  const teamsOptions = [...teams, DEFAULT_DROPDOWN_ITEM];
  const [selectedTeamFocus, setSelectedTeamFocus] = useState<TeamTag>(getSelectedDropdownItem(teamId, teams));

  useEffect(() => {
    const newSelectedTeamFocus = getSelectedDropdownItem(teamId, teams);
    setSelectedTeamFocus(newSelectedTeamFocus);
  }, [teamId, teams]);

  const onAfterTeamFocusUpdated = (): void => {
    fetchCurrentRole(updateCurrentUserRole);
    triggerCacheInvalidation();
    refreshConnection();
    hideLoadingIndicator();
  };

  const onChangeTeamFocus = (selectedItem: TeamTag): void => {
    showLoadingIndicator();
    setSelectedTeamFocus(selectedItem);
    if (selectedItem.id === '') {
      deleteTeamFocus()
        .filter(result => !isLoading(result))
        .once(onAfterTeamFocusUpdated);
    } else {
      updateTeamFocus(selectedItem.id)
        .filter(result => !isLoading(result))
        .once(onAfterTeamFocusUpdated);
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
