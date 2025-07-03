/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';
import { TeamTag } from '@instana/types';

import { getTagsResult } from 'in-settings/tabs/SecurityAndAccess/api/tags';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface TeamOption {
  id: string | null;
  displayName: string;
}

interface TeamsSelectOptionsResult {
  teamOptions: TeamOption[];
  selectedTeam: TeamOption;
  teamsLoading: boolean;
  teamsError: boolean;
}

export function useTeamsSelectOptions(selectedId: string | null): TeamsSelectOptionsResult {
  const defaultOption = { id: null, displayName: t('in-settings:components.select') };

  const result = useObservable(getTagsResult, []) ?? pendingResult;
  const teamsLoading = isLoading(result);
  const teamsError = hasError(result);
  const teams: TeamTag[] = result?.data ?? [];
  const sorted = [...teams].sort((a, b) => a.displayName.localeCompare(b.displayName));

  const teamOptions = [defaultOption, ...sorted];
  const selectedTeam = teamOptions.find(team => team.id === selectedId) ?? defaultOption;

  return {
    teamOptions,
    selectedTeam,
    teamsLoading,
    teamsError
  };
}
