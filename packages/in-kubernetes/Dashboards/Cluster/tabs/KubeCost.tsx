/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { KubernetesCluster, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Li } from '@instana/components';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import getRelatedResourcesForKubeCost from 'in-kubernetes/subscriptions/getRelatedResourcesForKubeCost';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn/CenterAlignmentColumn';
import updateTimeConfig from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/updateTimeConfig';
import KubeCostMetrics from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/KubeCostMetrics';
import KubeCostBanner from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/KubeCostBanner';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import Banner from 'in-kubernetes/Dashboards/Cluster/tabs/Banner/Banner';
import { getMetricForFocusedMoment } from 'in-stores/metric/metric';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import ArticleContent from 'in-components/ArticleContent';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface SummaryProps {
  data: KubernetesCluster;
  timeConfig: TimeConfig;
}

export default function KubeCost({ timeConfig, data: cluster }: SummaryProps) {
  const id = cluster.id;
  const kubeCostData =
    useObservable(
      () =>
        getRelatedResourcesForKubeCost({
          id,
          timeConfig
        }),
      []
    ) ?? pendingResult;

  const { loading } = kubeCostData.progress;
  let license: string | undefined = kubeCostData?.data?.tier;
  let isEnterprise: boolean = license === 'ENTERPRISE';
  let finalTimeConfig: TimeConfig = isEnterprise ? timeConfig : updateTimeConfig(timeConfig);

  const snapshotId = kubeCostData?.data?.id;
  const coreCount =
    useObservable(
      snapshotId
        ? () =>
            getMetricForFocusedMoment({
              snapshotId: snapshotId,
              metric: 'coreCountStats.coreCountByCluster'
            })
              .map((v: [number, number]) => v[1])
              .distinct()
        : undefined, // if snapshotId is not available, don't subscribe
      [snapshotId, timeConfig]
    ) ?? 0;

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <>
      {!loading && kubeCostData.data ? (
        <>
          <ViewTrackingMeta
            data={{
              productArea: productAreas.kubernetes,
              pageRootName: pageNames.cluster_cost
            }}
          />
          {!isEnterprise && <KubeCostBanner coreCount={coreCount} />}
          <KubeCostMetrics kubeCostData={kubeCostData.data} timeConfig={finalTimeConfig} cluster={cluster} />
        </>
      ) : (
        <>
          <Banner
            targetProductName="KubeCost"
            expanded="showKubeCostInfoPanel"
            variation="configure"
            headline={t('in-kubernetes:dashboards.kubecost.costKubernetes')}
            tag={t('in-kubernetes:dashboards.kubecost.configureNow')}
            showLabel={t('in-kubernetes:dashboards.kubecost.configureforFree')}
            description={t('in-kubernetes:dashboards.kubecost.configureKubecostForFree')}
            primaryCta={{
              label: t('in-kubernetes:dashboards.kubecost.configureNow'),
              href: 'https://ibm.biz/kubecost',
              target: '_blank'
            }}
            secondaryCta={{
              label: t('in-kubernetes:dashboards.kubecost.learnMore'),
              href: 'https://www.kubecost.com',
              target: '_blank'
            }}
          />
          <Li>
            <CenterAlignmentColumn>
              <EntityPageMainNotification
                icon="lib_missing_data"
                title="Cost information not found"
                explanation={() => (
                  <ArticleContent markdownContent={t('in-kubernetes:dashboards.kubecost.noKubecostData')} />
                )}
              />
            </CenterAlignmentColumn>
          </Li>
        </>
      )}
    </>
  );
}
