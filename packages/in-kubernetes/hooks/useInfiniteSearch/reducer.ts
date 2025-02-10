/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { KubernetesClusterListItem, PaginatedResult, Result } from '@instana/types';

import { isLoading, emptyListResult } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { merge } from 'in-services/util/resultMerger';

export type ActionsTypes = 'SET_RESULT' | 'SET_PAGE ' | 'IS_RESETTING_STATE';

export const actions: Record<string, any> = {
  setResult: 'SET_RESULT',
  setPage: 'SET_PAGE',
  setIsResettingState: 'IS_RESETTING_STATE'
};

export type Action = {
  type: ActionsTypes;
  payload?: boolean | number | ResultPayload;
};

interface ResultPayload {
  result: Result<PaginatedResult<KubernetesClusterListItem>>;
  hasTimeConfigChanged: boolean;
}

interface StateProps {
  result: Result<PaginatedResult<KubernetesClusterListItem>>;
  isResettingState: boolean;
  page: number;
}

export const initialState: StateProps = {
  result: pendingResult,
  isResettingState: false,
  page: 1
};

export function stateReducer(state: StateProps, { type, payload }: Action): StateProps {
  switch (type) {
    case actions.setResult: {
      const { result, hasTimeConfigChanged } = payload as ResultPayload;
      return {
        ...state,
        result: mergeResults(state.result, result, hasTimeConfigChanged),
        isResettingState: false
      };
    }
    case actions.setResetState: {
      return {
        ...state,
        page: 1,
        result: pendingResult,
        isResettingState: true
      };
    }
    case actions.setIsResettingState: {
      return {
        ...state,
        isResettingState: payload as boolean
      };
    }
    case actions.setPage: {
      return {
        ...state,
        page: payload as number,
        isResettingState: false
      };
    }
    default:
      return state;
  }
}

function mergeResults(
  prev: Result<PaginatedResult<KubernetesClusterListItem>>,
  res: Result<PaginatedResult<KubernetesClusterListItem>>,
  hasTimeConfigChanged?: boolean
) {
  const previous = isLoading(prev) ? emptyListResult : prev;

  return merge(
    [previous, res],
    ([{ items: oldItems, totalHits: oldTotalHits }, { items: newItems, totalHits, ...props }]) => {
      const shouldNotMergeData = oldTotalHits !== totalHits || hasTimeConfigChanged;
      const items = shouldNotMergeData ? [...newItems] : [...oldItems, ...newItems];
      return {
        items,
        totalHits,
        ...props
      };
    }
  );
}
