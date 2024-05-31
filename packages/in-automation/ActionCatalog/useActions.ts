/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { error, hasError, isLoading, success } from 'in-services/util/result';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { pendingResult } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import { getActions } from 'in-automation/api';
import { Action, Result } from 'in-types';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export default function useActions() {
  return useObservable(refreshSignal.flatMap(getActions), []) ?? (pendingResult as Result<Action[]>);
}

interface UseActionsProps {
  actions: Result<Action[]>;
}

export function useUserActions({ actions }: UseActionsProps) {
  if (isLoading(actions)) return pendingResult as Result<Action[]>;
  if (hasError(actions)) return error<Action[]>([{ message: 'Failed to load user actions.', code: 'SERVER' }]);
  return success(
    actions.data!.filter(action => {
      const aiMetadataExists = action.metadata?.ai && action.metadata?.builtIn;
      return !aiMetadataExists;
    })
  );
}

export function useAIActions({ actions }: UseActionsProps) {
  if (isLoading(actions)) return pendingResult as Result<Action[]>;
  if (hasError(actions)) return error<Action[]>([{ message: 'Failed to load ai actions.', code: 'SERVER' }]);

  return success(
    actions.data!.filter(action => {
      const aiMetadataExists = action.metadata?.ai && action.metadata.ai.length > 0;

      return action.metadata?.builtIn && aiMetadataExists;
    })
  );
}

export interface UsePaginatedActionsParams {
  actions: Result<Action[]>;
  serverTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>;
  setServerTableUrlState: (
    serverTableUrlState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>
  ) => void;
  tags: string[];
  type?: string;
}

export function usePaginatedActions({
  actions,
  serverTableUrlState,
  setServerTableUrlState,
  tags,
  type
}: UsePaginatedActionsParams) {
  const filters = [
    {
      key: 'type' as const,
      value: type
    },
    {
      key: 'tags' as const,
      value: tags
    }
  ];

  const filteredActions = mapData(actions, data =>
    data?.filter(action =>
      filters.reduce((shouldInclude, filter) => {
        const emptyFilter = !filter.value?.length;
        if (emptyFilter) return shouldInclude;
        switch (filter.key) {
          case 'type':
            return shouldInclude && action.type === type;
          case 'tags':
            return shouldInclude && (action.tags?.some(tag => filter.value?.includes(tag)) ?? false);
        }
      }, true)
    )
  );
  return usePaginatedResult({
    result: filteredActions,
    serverTableUrlState,
    setServerTableUrlState,
    searchAttributes: ['name', 'description', action => action?.tags?.toString() ?? '']
  });
}
