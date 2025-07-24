/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import type {
  Cursor,
  CursorPaginatedResult,
  Cursorific,
  PaginatedResult,
  Result,
  Website,
  WebsiteItem
} from '@instana/types';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import type { GetCursorPaginated, State } from 'in-hooks/useCursorPagination';
import getWebsites from 'in-websites/subscriptions/getWebsites';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { hasError, isLoading } from 'in-services/util/result';
import type { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { collationLanguage } from 'in-i18n';

interface WebsiteEntitiesResult {
  entities: Website[];
  canLoadMore: boolean;
  loadMore: () => void;
}

interface UseWebsiteEntitiesProps {
  query?: string;
  options?: {
    retrievalSize?: number;
  };
}

interface PageCursor extends Cursor {
  page: number;
  pageSize: number;
}

type WebsiteWithCursor = Website & Cursorific<PageCursor>;

const defaultOptions = {
  retrievalSize: 20
};

export default function useWebsiteEntities({
  query,
  options
}: UseWebsiteEntitiesProps): FetchedState<WebsiteEntitiesResult> {
  const optionsWithDefaults = {
    ...defaultOptions,
    ...options
  };
  const timeConfig = useTimeConfig();
  const retrievalSize = optionsWithDefaults.retrievalSize;

  const result = useCursorPagination(
    getWebsitesWithEmulatedCursorPagination({
      pagination: {
        page: 1,
        pageSize: retrievalSize
      },
      order: {
        by: 'websiteLabel',
        direction: 'ASC',
        collation: collationLanguage
      },
      metrics: {},
      labelFilter: query,
      timeConfig
    }),
    [query, timeConfig, retrievalSize]
  );

  return resultToFetchedStateResponse(stateToResult(result));
}

function checkCanLoadMore(data?: PaginatedResult<WebsiteItem>): boolean {
  if (!data) return false;

  const { page, pageSize, totalHits } = data;
  return page * pageSize < totalHits;
}

function getWebsitesWithEmulatedCursorPagination(
  parameters: Parameters<typeof getWebsites>[0]
): GetCursorPaginated<PageCursor, WebsiteWithCursor> {
  return ({ cursor }) => {
    const nextCursor: PageCursor = {
      page: cursor ? cursor.page + 1 : parameters.pagination.page,
      pageSize: cursor?.pageSize ?? parameters.pagination.pageSize
    };

    return getWebsites({
      ...parameters,
      pagination: nextCursor
    }).map(result => {
      // The result type only specifies the data type as generic,
      // a erroneous or loading result does not usually carry data, so its safe to just cast for simplicity
      if (isLoading(result) || hasError(result))
        return result as unknown as Result<CursorPaginatedResult<WebsiteWithCursor>>;

      const websitesWithCursor: WebsiteWithCursor[] =
        result.data?.items?.map(i => ({ ...i.website, cursor: nextCursor })) ?? [];
      const cursorPaginatedResult: CursorPaginatedResult<WebsiteWithCursor> = {
        ...(result.data ?? { page: 0, pageSize: 0, totalHits: 0 }),
        items: websitesWithCursor,
        canLoadMore: checkCanLoadMore(result.data),

        // Its unclear what these two do or if their values have any meaning to the frontend
        totalRetainedItemCount: nextCursor.page * nextCursor.pageSize,
        totalRepresentedItemCount: nextCursor.page * nextCursor.pageSize
      };
      const mappedResult: Result<CursorPaginatedResult<WebsiteWithCursor>> = {
        ...result,
        data: cursorPaginatedResult
      };
      return mappedResult;
    });
  };
}

function stateToResult(
  state: State<PageCursor, WebsiteWithCursor> & {
    loadMore: () => void;
  }
): Result<WebsiteEntitiesResult> {
  return {
    errors: state.errors,
    progress: state.progress,
    data: {
      entities: state.items,
      canLoadMore: state.canLoadMore,
      loadMore: state.loadMore
    }
  };
}
