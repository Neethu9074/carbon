/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';

import {
  Stack,
  Spacer,
  SvgIcon,
  CarbonIconButton,
  CarbonTile,
  CarbonSearch,
  CarbonPopover,
  CarbonButton,
  CarbonPopoverContent,
  Typography
} from '@instana/components';
import { Observable } from '@instana/observables';

import {
  cronJobs,
  getUrlStateDefinition,
  name,
  namespaces,
  runningPods,
  services,
  sortBy,
  unhealthyDeployments,
  unhealthyNodes,
  ItemAdditionalInfo
} from 'in-kubernetes/utils';
import {
  BaseProps,
  clusterListFullyQualified,
  IdsProps,
  namespaceListFullyQualified
} from 'in-kubernetes/navigation/paths';
import SortingConfigurator, {
  DropdownItem
} from 'in-kubernetes/lists/components/SortingConfigurator/SortingConfigurator';
import InfoCard, { KubernetesCountersProps, Workload } from 'in-kubernetes/lists/components/InfoCard/InfoCard';
import { KubernetesClusterListItem, KubernetesNamespaceListItem, PaginatedResult, Result } from 'in-types';
import InfoCardSkeleton from 'in-kubernetes/lists/components/InfoCardSkeleton/InfoCardSkeleton';
import useInfiniteSearch from 'in-kubernetes/hooks/useInfiniteSearch/useInfiniteSearch';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { QueryParams } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import { useLocalStorage } from 'in-services/localStorage';
import { pageNames } from 'in-services/tracking/pageNames';
import { deepFreeze } from 'in-services/util/object';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title/Title';
import { t, Trans } from 'in-i18n';

import locals from './ResourceCardList.mless';

interface ResourceCardListProps {
  subscription: ({
    query,
    page,
    pageSize,
    orderBy,
    orderDirection,
    timeConfig
  }: QueryParams) => Observable<Result<PaginatedResult<any>>>;
  type: Workload;
  getHrefs: (id: string, { tab, tabMatrix, timeConfig, clusterId }: BaseProps & Pick<IdsProps, 'clusterId'>) => string;
  workloads: string[];
  hasSortingEnabled: boolean;
}

export default function ResourceCardList({
  subscription,
  type,
  getHrefs,
  workloads,
  hasSortingEnabled
}: Readonly<ResourceCardListProps>) {
  const isClusterType = type === 'cluster';
  const urlStateDefinition = getUrlStateDefinition(isClusterType);
  const { location, navigate } = useNavigation();
  const searchRef = useRef<HTMLDivElement>(null);
  const { kubernetesViewModeToggled, kubernetesSearchBarCleared, kubernetesSortingChanged } = useKubernetesTracker();
  const [isTooltipSeen, setIsTooltipSeen] = useLocalStorage('k8sClusterNamespaceTooltipSeen', false);
  const [{ orderBy, orderDirection }, setUrlState] = useUrlState(urlStateDefinition);
  const [itemsAdditionalInfo, setItemsAdditionalInfo] = useState<ItemAdditionalInfo>({});

  const {
    debouncedQuery,
    isLoadingData,
    canLoadMore,
    loadMoreContainerRef,
    hasNoItems,
    hasErrors,
    isInitialLoading,
    errors,
    items
  } = useInfiniteSearch({ subscription, urlStateDefinition });

  // Sort the indices instead of the whole array of objects, to improve performance.
  const sortedIndexes = useMemo(
    () => sortByIndex(itemsAdditionalInfo, orderBy, orderDirection, items),
    [items, orderBy, orderDirection, itemsAdditionalInfo]
  );

  const handleAdditionInfo = (id: string, data: KubernetesCountersProps) => {
    if (itemsAdditionalInfo[id]) return;
    setItemsAdditionalInfo(prev => ({ ...prev, [id]: data }));
  };

  // Auto focus search bar input
  useEffect(() => {
    if (searchRef?.current) {
      searchRef?.current?.querySelector('input')?.focus();
    }
  }, []);

  if (isInitialLoading) {
    return <LoadingIndicator />;
  }

  const sortingOptions: DropdownItem[] = deepFreeze([
    { label: t('in-kubernetes:cloudNative.sortingOptions.name'), value: name },
    { label: t('in-kubernetes:cloudNative.sortingOptions.unhealthyNodes'), value: unhealthyNodes },
    { label: t('in-kubernetes:cloudNative.sortingOptions.unhealthyDeployments'), value: unhealthyDeployments },
    { label: t('in-kubernetes:cloudNative.sortingOptions.runningPods'), value: runningPods },
    { label: t('in-kubernetes:cloudNative.sortingOptions.namespaces'), value: namespaces },
    { label: t('in-kubernetes:cloudNative.sortingOptions.services'), value: services },
    { label: t('in-kubernetes:cloudNative.sortingOptions.cronJobs'), value: cronJobs }
  ]).filter(item => item.value === 'name' || workloads.includes(item.value));

  const pathname = `${isClusterType ? clusterListFullyQualified : namespaceListFullyQualified}/table`;

  return (
    <>
      <Title title={t(`in-kubernetes:${isClusterType ? 'clusters' : 'namespaces'}`)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: isClusterType ? pageNames.kubernetes_clusters : pageNames.kubernetes_namespaces
        }}
      />
      <CarbonTile>
        <Stack direction="horizontal" align="center" distribution="spaceBetween" gap="xsmall">
          <div className={locals.searchBar} ref={searchRef}>
            <CarbonSearch
              value={debouncedQuery.value}
              placeholder={t('in-components:carbonSearchBar.search')}
              onChange={e => debouncedQuery.onChange(e.target.value)}
              onClear={() => kubernetesSearchBarCleared({})}
              labelText=""
            />
          </div>

          {hasSortingEnabled && (
            <SortingConfigurator
              options={sortingOptions}
              order={{
                by: orderBy,
                direction: orderDirection
              }}
              onChange={event => {
                const hasSelectedItem = 'selectedItem' in event;
                const selectedOrderBy = hasSelectedItem ? event.selectedItem?.value : orderBy;
                const selectedOrderDirection = hasSelectedItem
                  ? orderDirection
                  : orderDirection === 'ASC'
                  ? 'DESC'
                  : 'ASC';

                setUrlState({
                  orderBy: selectedOrderBy,
                  orderDirection: selectedOrderDirection
                });

                kubernetesSortingChanged({
                  orderBy: selectedOrderBy,
                  orderDirection: selectedOrderDirection
                });
              }}
            />
          )}

          <CarbonPopover open={!isTooltipSeen} autoAlign caret highContrast>
            <CarbonIconButton
              align="left"
              kind="ghost"
              size="lg"
              label={t('in-kubernetes:cloudNative.switchToTableView')}
              onClick={() => {
                kubernetesViewModeToggled({
                  switchedToView: 'table',
                  tab: type
                });
                navigate({ ...location, pathname }, true);
              }}
            >
              <SvgIcon type="lib_views_list" size="s" />
            </CarbonIconButton>
            <CarbonPopoverContent className={locals.popoverInfo}>
              <Typography variant="heading-01" component="h2">
                {t('in-kubernetes:cloudNative.popover.title')}
              </Typography>
              <Typography variant="body-01" component="p">
                <Trans i18nKey="in-kubernetes:cloudNative.popover.content" />
              </Typography>
              <Stack direction="vertical" align="end">
                <CarbonButton className={locals.acknowledgment} size="sm" onClick={() => setIsTooltipSeen(true)}>
                  {t('in-kubernetes:cloudNative.popover.button')}
                </CarbonButton>
              </Stack>
            </CarbonPopoverContent>
          </CarbonPopover>
        </Stack>
      </CarbonTile>

      <Spacer vertical="large" />

      {hasNoItems && <NoDataAvailable height={160} />}
      {hasErrors && !isInitialLoading && <ErroneousResultPresenter errors={errors} />}
      {isLoadingData && (
        <>
          <InfoCardSkeleton numberOfCards={workloads.length} />
          <InfoCardSkeleton numberOfCards={workloads.length} />
        </>
      )}

      {sortedIndexes?.map(index => (
        <InfoCard
          key={`${items?.[index].id}_${index}`}
          type={type}
          data={items?.[index]}
          onDataFetched={handleAdditionInfo}
          getHrefs={getHrefs}
          workloads={workloads}
        />
      ))}

      <div ref={loadMoreContainerRef as React.MutableRefObject<HTMLDivElement>} className={locals.loadMoreContainer} />

      {canLoadMore && <InfoCardSkeleton numberOfCards={workloads.length} />}
    </>
  );
}

export function sortByIndex(
  itemsAdditionalInfo: ItemAdditionalInfo,
  orderBy: string,
  orderDirection: string,
  items?: KubernetesClusterListItem[] | KubernetesNamespaceListItem[]
) {
  // Sometimes the itemsAdditionalInfo is not fully loaded (items are still not visible in the viewport)
  // and the user triggers to fetch more data, preventing sorting to happen.
  // This threshold will trigger the sorting if 90% of data is available.
  const threshold = 0.9;

  if (!items) return [];

  const indices = [...items].map((_, index) => index);

  const enoughDataAvailable = Object.keys(itemsAdditionalInfo).length >= Math.floor(items.length * threshold);

  return !enoughDataAvailable
    ? indices
    : indices.sort((current, next) => {
        const sorted = sortBy({ orderBy, orderDirection, itemsAdditionalInfo })(items[current], items[next]);

        // If has the same value, sort by name
        if (sorted === 0) {
          return sortBy({ orderBy: 'name', orderDirection: 'ASC', itemsAdditionalInfo })(items[current], items[next]);
        }

        return sorted;
      });
}
