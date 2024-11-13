/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo, useRef, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { SyntheticTest } from '@instana/types';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { getTests } from 'in-synthetics/api';

interface PaginatedCursorState {
  limit: number;
  offset: number;
}

interface SyntheticTestsResult {
  tests: SyntheticTest[];
  canLoadMore: boolean;
  loadMore: () => void;
}

interface UseSyntheticTestsCursorPaginatedProps {
  query?: string;
  location?: string;
  retrievalSize?: number;
  skip?: boolean;
}

export default function useSyntheticTestsCursorPaginated(
  { query, location, skip }: UseSyntheticTestsCursorPaginatedProps,
  retrievalSize: number = 10
): FetchedState<SyntheticTestsResult> {
  const [{ limit, offset }, setPaginatedCursor] = useState<PaginatedCursorState>({ limit: retrievalSize, offset: 0 });
  const memorizedTests = useMemo(getTests, []);
  const queryRef = useRef(query);
  const locationRef = useRef(location);

  const result =
    useObservable(() => {
      // skip loading anything - e.g. when config dialog is in edit mode
      if (skip) return successObservable<SyntheticTest[]>([]);

      // reset pagination when query or location has changed and return pending
      if (queryRef.current !== query || locationRef.current !== location) {
        queryRef.current = query;
        locationRef.current = location;
        setPaginatedCursor({ offset, limit: retrievalSize });
        return undefined;
      }

      return memorizedTests.map(result => {
        const items = result.data ?? [];
        const filteredItems = items.filter(({ label, locations }) => {
          const matchQuery = query === undefined || label.match(new RegExp(query, 'gi'));
          const matchLocation = location === undefined || locations.includes(location);
          return matchQuery && matchLocation;
        });

        const paginatedItems = filteredItems.slice(offset, limit);

        return {
          ...result,
          data: paginatedItems
        };
      });
    }, [query, location, limit, offset]) ?? pendingResult;

  const tests = result?.data ?? [];

  return resultToFetchedStateResponse({
    ...result,
    data: {
      tests,
      canLoadMore: tests.length >= limit,
      loadMore: () => setPaginatedCursor({ limit: limit + retrievalSize, offset })
    }
  });
}
