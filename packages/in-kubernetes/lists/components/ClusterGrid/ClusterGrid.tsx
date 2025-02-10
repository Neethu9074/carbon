/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonTile, Spacer, SvgIcon, CarbonIconButton, Stack } from '@instana/components';
import { KubernetesClusterListItem } from '@instana/types';

import { getKubernetesClustersWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import InfoCardSkeleton from 'in-kubernetes/lists/components/InfoCardSkeleton/InfoCardSkeleton';
import useInfiniteSearch from 'in-kubernetes/hooks/useInfiniteSearch/useInfiniteSearch';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import CarbonSearchBar from 'in-components/CarbonSearchBar/CarbonSearchBar';
import { clusterListFullyQualified } from 'in-kubernetes/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import InfoCard from 'in-kubernetes/lists/components/InfoCard/InfoCard';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './ClusterGrid.mless';

export default function ClusterGrid() {
  const { location, navigate } = useNavigation();
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
  } = useInfiniteSearch({ subscription: getKubernetesClustersWithDefaults });

  if (isInitialLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Title title={t('in-kubernetes:clusters')} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.kubernetes_clusters
        }}
      />
      <CarbonTile>
        <Stack direction="horizontal" align="center" distribution="spaceBetween" gap="xsmall">
          <CarbonSearchBar
            query={debouncedQuery.value}
            onChange={value => debouncedQuery.onChange(value)}
            autoFocus={debouncedQuery.value !== ''}
          />

          <CarbonIconButton
            align="left"
            kind="ghost"
            size="lg"
            label={t('in-kubernetes:cloudNative.switchToTableView')}
            onClick={() => navigate({ ...location, pathname: `${clusterListFullyQualified}/table` }, true)}
          >
            <SvgIcon type="lib_views_list" size="s" />
          </CarbonIconButton>
        </Stack>
      </CarbonTile>

      <Spacer vertical="large" />

      {hasNoItems && <NoDataAvailable height={160} />}
      {hasErrors && !isInitialLoading && <ErroneousResultPresenter errors={errors} />}
      {isLoadingData && (
        <>
          <InfoCardSkeleton />
          <InfoCardSkeleton />
        </>
      )}

      {items?.map(({ cluster, ...props }: KubernetesClusterListItem, index: number) => (
        <InfoCard key={`${cluster.id}_${index}`} {...props} {...cluster} />
      ))}

      <div ref={loadMoreContainerRef as React.MutableRefObject<HTMLDivElement>} className={locals.loadMoreContainer} />

      {canLoadMore && <InfoCardSkeleton />}
    </>
  );
}
