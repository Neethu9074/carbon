/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useRef, useEffect } from 'react';

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

import SortingConfigurator from 'in-kubernetes/lists/components/SortingConfigurator/SortingConfigurator';
import InfoCardSkeleton from 'in-kubernetes/lists/components/InfoCardSkeleton/InfoCardSkeleton';
import { CardProps, getSortingOptions, generateCard, Item } from 'in-kubernetes/lists/utils';
import useInfiniteSearch from 'in-kubernetes/hooks/useInfiniteSearch/useInfiniteSearch';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { QueryParams } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import { TrackingFunction, useKubernetesTracker } from 'in-kubernetes/tracker';
import InfoCards from 'in-kubernetes/lists/components/InfoCards/InfoCards';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { useLocalStorage } from 'in-services/localStorage';
import { PaginatedResult, Result } from 'in-types';
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
  getHref: (id: string) => string;
  cardDefinitions: CardProps[];
  urlStateDefinition: any;
  pathname: string;
  pageTitle: string;
  pageRootName: string;
}

export default function ResourceCardList({
  subscription,
  getHref,
  pathname,
  pageRootName,
  pageTitle,
  urlStateDefinition,
  cardDefinitions
}: Readonly<ResourceCardListProps>) {
  const searchRef = useRef<HTMLDivElement>(null);
  const { location, navigate } = useNavigation();
  const [isTooltipSeen, setIsTooltipSeen] = useLocalStorage('k8sClusterNamespaceTooltipSeen', false);
  const [{ orderBy, orderDirection }, setUrlState] = useUrlState(urlStateDefinition);
  const { kubernetesViewModeToggled, kubernetesCardClicked, kubernetesSearchBarCleared, kubernetesSortingChanged } =
    useKubernetesTracker();

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

  // Auto focus search bar input
  useEffect(() => {
    if (searchRef?.current) {
      searchRef?.current?.querySelector('input')?.focus();
    }
  }, []);

  if (isInitialLoading) {
    return <LoadingIndicator />;
  }

  const onTracking = kubernetesCardClicked;
  const sortingOptions = getSortingOptions(cardDefinitions, ['unhealthyNodes', 'unhealthyDeployments']);
  const infoCards = getInfoCardData(getHref, cardDefinitions, onTracking, items);

  return (
    <>
      <Title title={pageTitle} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName
        }}
      />
      <CarbonTile className={locals.tile}>
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

          <CarbonPopover open={!isTooltipSeen} autoAlign caret highContrast>
            <CarbonIconButton
              align="left"
              kind="ghost"
              size="lg"
              label={t('in-kubernetes:cloudNative.switchToTableView')}
              onClick={() => {
                kubernetesViewModeToggled({
                  switchedToView: 'table',
                  tab: pageTitle.toLowerCase()
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
          <InfoCardSkeleton numberOfCards={cardDefinitions.length} />
          <InfoCardSkeleton numberOfCards={cardDefinitions.length} />
        </>
      )}

      <InfoCards data={infoCards} />
      <div ref={loadMoreContainerRef as React.MutableRefObject<HTMLDivElement>} className={locals.loadMoreContainer} />
      {canLoadMore && <InfoCardSkeleton numberOfCards={cardDefinitions.length} />}
    </>
  );
}

function getInfoCardData(
  getHref: (id: string) => string,
  cardDefinitions: CardProps[],
  onTracking: TrackingFunction,
  items?: Item[]
) {
  if (!items) {
    return;
  }

  return items?.map(item => {
    const isCluster = 'cluster' in item;
    const clusterOrNamespace = isCluster ? item.cluster : item.namespace;
    const id = clusterOrNamespace?.id;
    const title = (isCluster ? item?.name : item.label) ?? '';
    const subTitle = !isCluster ? item.clusterName : '';
    const distribution = clusterOrNamespace?.clusterDistribution ?? 'kubernetes';
    const icon = isCluster ? `lib_${distribution}` : `lib_kubernetes_namespace`;
    const version = isCluster ? item?.cluster.version : '';
    const href = getHref(id);
    const header = {
      id,
      icon,
      href,
      title,
      subTitle,
      version,
      distribution
    };

    const cards = cardDefinitions.map((cardDefinition: CardProps) =>
      generateCard({
        item,
        getHref,
        onTracking,
        ...cardDefinition
      })
    );

    return { header, cards };
  });
}
