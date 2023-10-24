/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Application, ApplicationCursorPaginatedItem, Result } from '@instana/types';
import { IngestionOffsetCursor } from '@instana/types/typeDefinitions';

import getApplicationsCursorPaginated from 'in-applications/subscriptions/getApplicationsCursorPaginated';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import useCursorPagination, { State } from 'in-hooks/useCursorPagination';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface ApplicationEntitiesResult {
  entities: Application[];
  canLoadMore: boolean;
  loadMore: () => void;
}

interface UseApplicationEntitiesProps {
  query?: string;
  options?: {
    retrievalSize?: number;
  };
}

const defaultOptions = {
  retrievalSize: 20
};

export default function useApplicationEntities({
  query,
  options
}: UseApplicationEntitiesProps): FetchedState<ApplicationEntitiesResult> {
  const optionsWithDefaults = {
    ...defaultOptions,
    ...options
  };
  const timeConfig = useTimeConfig();
  const retrievalSize = optionsWithDefaults.retrievalSize;

  const result = useCursorPagination<IngestionOffsetCursor, ApplicationCursorPaginatedItem>(
    ({ cursor }) =>
      getApplicationsCursorPaginated({
        pagination: {
          cursor,
          retrievalSize
        },
        order: {
          by: 'applicationLabel',
          direction: 'ASC'
        },
        metrics: {},
        filter: {
          label: query,
          includeInternalCalls: true,
          includeSyntheticCalls: true,
          timeConfig,
          useLongTermDataOnly: false
        },
        supportedOrderByCriteria: false
      }),
    [query, timeConfig, retrievalSize]
  );
  return resultToFetchedStateResponse(toApplicationEntitiesResult(result));
}

function toApplicationEntitiesResult(
  state: State<IngestionOffsetCursor, ApplicationCursorPaginatedItem> & { loadMore: () => void }
): Result<ApplicationEntitiesResult> {
  return {
    errors: state.errors,
    progress: state.progress,
    data: {
      entities: state.items.map(i => i.application),
      canLoadMore: state.canLoadMore,
      loadMore: state.loadMore
    }
  };
}
