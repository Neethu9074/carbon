/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { KubernetesCluster, TimeConfig } from '@instana/types';
import { Li, Spacer } from '@instana/components';
import { useObservable } from '@instana/hooks';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import getRelatedResourcesForKubeCost from 'in-kubernetes/subscriptions/getRelatedResourcesForKubeCost';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn/CenterAlignmentColumn';
import updateTimeConfig from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/updateTimeConfig';
import { getUpgradeBannerMessage } from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/utils';
import KubeCostMetrics from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/KubeCostMetrics';
import KubeCostBanner from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/KubeCostBanner';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import Banner from 'in-kubernetes/Dashboards/Cluster/tabs/Banner/Banner';
import { getMetricForFocusedMoment } from 'in-stores/metric/metric';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import ArticleContent from 'in-components/ArticleContent';
import { pendingResult } from 'in-services/fixedObjects';
import { solisEnabled } from 'in-services/featureFlags';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

interface SummaryProps {
  data: KubernetesCluster;
  timeConfig: TimeConfig;
}

export default function KubeCost({ timeConfig, data: cluster }: SummaryProps) {
  const { trackCta } = useSegmentTracking();

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

  const loading = isLoading(kubeCostData);
  const license: string | undefined = kubeCostData?.data?.tier;
  const isEnterprise: boolean = license === 'ENTERPRISE';
  const hasData = !!kubeCostData.data;

  const finalTimeConfig: TimeConfig = isEnterprise ? timeConfig : updateTimeConfig(timeConfig);

  const snapshotId = kubeCostData?.data?.id;
  const coreCount =
    useObservable(
      snapshotId
        ? () =>
            getMetricForFocusedMoment({
              snapshotId,
              metric: 'coreCountStats.coreCountByCluster'
            })
              .map((v: [number, number]) => v[1])
              .distinct()
        : undefined,
      [snapshotId, timeConfig]
    ) ?? 0;

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      {hasData ? (
        <>
          <ViewTrackingMeta
            data={{
              productArea: productAreas.kubernetes,
              pageRootName: pageNames.cluster_cost
            }}
          />

          {solisEnabled ? (
            <>
              {!isEnterprise && (
                // @ts-expect-error TS2304: Cannot find name solis
                // component is loaded from a script in ui-client/packages/in-client/index.html
                <solis-teaser product="kubecost" type="banner" variation="licensing" sub_variation="enterprise" />
              )}
              {!isEnterprise && (
                <>
                  <Spacer size="normal" />
                  {getUpgradeBannerMessage(coreCount, trackCta)}
                  <Spacer size="normal" />
                </>
              )}
            </>
          ) : (
            !isEnterprise && <KubeCostBanner coreCount={coreCount} />
          )}

          <KubeCostMetrics kubeCostData={kubeCostData.data} timeConfig={finalTimeConfig} cluster={cluster} />
        </>
      ) : (
        <>
          {solisEnabled ? (
            // @ts-expect-error TS2304: Cannot find name solis
            // component is loaded from a script in ui-client/packages/in-client/index.html
            <solis-teaser product="kubecost" type="banner" variation="licensing" sub_variation="free" />
          ) : (
            <Banner
              targetProductName="KubeCost"
              expanded="showKubeCostInfoPanel"
              variation="configure"
              headline={t('in-kubernetes:dashboards.kubecost.costKubernetes')}
              tag={t('in-kubernetes:dashboards.kubecost.cost')}
              showLabel={t('in-kubernetes:dashboards.kubecost.showDetails')}
              description={t('in-kubernetes:dashboards.kubecost.configureKubecostForFree')}
              primaryCta={{
                label: t('in-kubernetes:dashboards.kubecost.configureNow'),
                href: 'https://ibm.biz/kubecost',
                target: '_blank'
              }}
              secondaryCta={{
                label: t('in-kubernetes:dashboards.kubecost.learnMore'),
                href: 'https://www.apptio.com/products/kubecost/contact/?utm_medium=referral&utm_source=instana-app&utm_campaign=cloud-dvop_global-global-en_kubecost&utm_term=instana',
                target: '_blank'
              }}
            />
          )}
         <Spacer size="large" />
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
