/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useEffect, useReducer } from 'react';
import { isEqual } from 'lodash';

import { Result, PaginatedResult, KubernetesClusterListItem } from '@instana/types';
import { Observable } from '@instana/observables';

import { initialState, stateReducer, actions } from 'in-kubernetes/hooks/useInfiniteSearch/reducer';
import { QueryParams } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import { hasError, isLoading } from 'in-services/util/result';
import useUrlState, { Options } from 'in-hooks/useUrlState';
import useInfiniteScroll from 'in-hooks/useInfiniteScroll';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { FilterProps } from 'in-kubernetes/utils';
import usePrevious from 'in-hooks/usePrevious';

interface Props {
  subscription: ({
    query,
    page,
    pageSize,
    orderBy,
    orderDirection,
    timeConfig
  }: QueryParams) => Observable<Result<PaginatedResult<KubernetesClusterListItem>>>;
  urlStateDefinition: Options<FilterProps>;
}

export default function useInfiniteSearch({ subscription, urlStateDefinition }: Props) {
  const timeConfig = useTimeConfig();
  const previousTimeConfig = usePrevious(timeConfig);
  const [{ result, page, isResettingState }, dispatch] = useReducer(stateReducer, initialState);
  const [{ query }, setUrlState] = useUrlState(urlStateDefinition);
  const { setResult, setPage, setResetState, setIsResettingState } = actions;
  const hasTimeConfigChanged: boolean = (previousTimeConfig && !isEqual(timeConfig, previousTimeConfig)) ?? false;
  const isLoadingData = isLoading(result);

  const resetState = () => dispatch({ type: setResetState });
  const dispatchResettingState = (value: boolean) => dispatch({ type: setIsResettingState, payload: value });
  const increasePage = (value: number) => dispatch({ type: setPage, payload: value });

  const debouncedQuery = useDebouncedValue(
    query ?? '',
    value => {
      resetState();
      setUrlState({ query: value });
      dispatchResettingState(false);
    },
    500
  );

  const fetchData = () =>
    subscription({
      timeConfig,
      query,
      page
    })
      .filter((res: Result<PaginatedResult<KubernetesClusterListItem>>) => !isLoading(res))
      .once((res: Result<PaginatedResult<KubernetesClusterListItem>>) => {
        dispatch({ type: setResult, payload: { result: res, hasTimeConfigChanged } });
      });

  // Fetch data
  // isResettingState is used to prevent fetching data when query is getting changed
  useEffect(() => {
    if (isResettingState) return;
    if (hasTimeConfigChanged) {
      resetState();
      dispatchResettingState(false);
    } else {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, hasTimeConfigChanged, isResettingState]);

  // Infinite scroll callback. It will increase the page number when the element is intersected.
  const infiniteScrollCallback = useCallback(
    ([element]: IntersectionObserverEntry[]) => {
      const canLoadMore = (result?.data?.items && result?.data?.items?.length < result?.data?.totalHits) ?? false;
      if (element.isIntersecting && !isLoadingData && canLoadMore) {
        increasePage(page + 1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoadingData, result]
  );

  const [loadMoreContainerRef] = useInfiniteScroll(infiniteScrollCallback, [infiniteScrollCallback]);
  const hasNoItems = result?.data?.totalHits === 0 || result?.data?.items?.length === 0;
  const hasErrors = hasError(result);
  const isInitialLoading = isLoading(result ?? []) && hasNoItems;
  const items = result?.data?.items;
  const errors = result?.errors;
  const canLoadMore = (result?.data?.items && result?.data?.items?.length < result?.data?.totalHits) ?? false;

  return {
    query,
    debouncedQuery,
    hasNoItems,
    hasErrors,
    errors,
    items,
    isInitialLoading,
    isLoadingData,
    canLoadMore,
    infiniteScrollCallback,
    loadMoreContainerRef
  };
}
