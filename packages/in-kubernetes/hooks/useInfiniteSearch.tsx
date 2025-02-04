/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useEffect, useState } from 'react';

import { Result, PaginatedResult, KubernetesCluster } from '@instana/types';
import { Observable } from '@instana/observables';

import { QueryParams } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import { emptyListResult, hasError, isLoading } from 'in-services/util/result';
import { clusterList as pathSegment } from 'in-kubernetes/navigation/paths';
import useInfiniteScroll from 'in-hooks/useInfiniteScroll';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import { merge } from 'in-services/util/resultMerger';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';

interface Props {
  subscription: ({
    query,
    page,
    pageSize,
    orderBy,
    orderDirection,
    timeConfig
  }: QueryParams) => Observable<Result<PaginatedResult<KubernetesCluster>>>;
}

export default function useInfiniteSearch({ subscription }: Props) {
  const timeConfig = useTimeConfig();
  const [result, setResult] = useState(pendingResult);
  const [{ query }, setUrlState] = useUrlState(urlStateDefinition);
  const [page, setPage] = useState(1);
  const [isUpdatingQuery, setIsUpdatingQuery] = useState(false);
  const isLoadingData = isLoading(result);
  const debouncedQuery = useDebouncedValue(
    query ?? '',
    value => {
      setIsUpdatingQuery(true);
      setResult(pendingResult);
      setUrlState({ query: value });
      setPage(1);
      setIsUpdatingQuery(false);
    },
    500
  );

  const fetchData = (page: number, query: string) => {
    subscription({
      timeConfig,
      query,
      page
    })
      .filter((res: any) => !isLoading(res))
      .once((res: Result<PaginatedResult<KubernetesCluster>>) => {
        setResult(prev => mergeResults(prev, res));
      });
  };

  // Fetch data only when query is not getting updated
  useEffect(() => {
    if (!isUpdatingQuery) {
      fetchData(page, query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, isUpdatingQuery]);

  // Infinite scroll callback. It will increase the number of page when the element is intersected.
  const infiniteScrollCallback = useCallback(
    ([element]: IntersectionObserverEntry[]) => {
      const canLoadMore = result?.data?.items.length < result?.data?.totalHits;
      if (element.isIntersecting && !isLoadingData && canLoadMore) {
        setPage(prev => prev + 1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoadingData, result]
  );

  const [loadMoreContainerRef] = useInfiniteScroll(infiniteScrollCallback, [infiniteScrollCallback]);
  const hasNoItems = result?.data?.totalHits === 0 || result?.data?.items?.length === 0;
  const items = result?.data?.items;
  const hasErrors = hasError(result);
  const errors = result?.errors;
  const isInitialLoading = isLoading(result) && result?.data?.items?.length === 0;

  return {
    query,
    debouncedQuery,
    hasNoItems,
    hasErrors,
    errors,
    items,
    isInitialLoading,
    isLoadingData,
    infiniteScrollCallback,
    loadMoreContainerRef
  };
}

function mergeResults(
  prev: Result<PaginatedResult<KubernetesCluster>>,
  res: Result<PaginatedResult<KubernetesCluster>>
) {
  const previous = isLoading(prev) ? emptyListResult : prev;
  return merge(
    [previous, res],
    ([{ items: oldItems, totalHits: oldTotalHits }, { items: newItems, totalHits, ...props }]) => {
      const items = oldTotalHits !== totalHits ? [...newItems] : [...oldItems, ...newItems];
      return {
        items,
        totalHits,
        ...props
      };
    }
  );
}

const urlStateDefinition = {
  bind: [
    {
      path: pathSegment,
      name: 'query',
      as: 'query',
      initialState: ''
    }
  ],
  resets: [
    {
      bind: [],
      reset: {}
    }
  ]
};
