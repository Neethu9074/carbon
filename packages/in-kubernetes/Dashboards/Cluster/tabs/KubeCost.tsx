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
import KubeCostMetrics from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/KubeCostMetrics';
import KubeCostBanner from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/KubeCostBanner';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import InfoPanel from 'in-automation/components/InfoPanel/InfoPanel';
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
  const kubeCostInfoContent = {
    title: t('in-kubernetes:dashboards.kubecost.costMonitoring'),
    columns: [
      {
        title: t('in-kubernetes:dashboards.kubecost.configureKubeCost'),
        text: t('in-kubernetes:dashboards.kubecost.freeTrial'),
        link: {
          url: 'https://ibm.biz/kubecost',
          label: t('in-kubernetes:dashboards.kubecost.configureNow')
        }
      },
      {
        title: t('in-kubernetes:dashboards.kubecost.connectSales'),
        text: t('in-kubernetes:dashboards.kubecost.salesTeam'),
        link: {
          url: 'https://www.kubecost.com/contact/',
          label: t('in-kubernetes:dashboards.kubecost.assessement')
        }
      },
      {
        title: t('in-kubernetes:dashboards.kubecost.helpGrow'),
        text: t('in-kubernetes:dashboards.kubecost.shareThoughts'),
        link: {
          url: 'https://your.feedback.ibm.com/jfe/form/SV_9vuvqild7snrUhw',
          label: t('in-kubernetes:dashboards.kubecost.feedback')
        }
      }
    ]
  };

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
  let coreCount = useObservable(
    () =>
      getMetricForFocusedMoment({
        snapshotId: snapshotId,
        metric: 'coreCountStats.coreCountByCluster'
      })
        .map((v: [number, number]) => v[1])
        .distinct(),
    [snapshotId, timeConfig]
  );

  coreCount = coreCount == null ? 0 : coreCount;
  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <>
      <InfoPanel content={kubeCostInfoContent} expanded="showKubeCostInfoPanel" />
      <Spacer size="normal" />
      {!loading && kubeCostData.data ? (
        <>
          <ViewTrackingMeta
            data={{
              productArea: productAreas.kubernetes,
              pageRootName: pageNames.cluster_cost
            }}
          />
          <KubeCostBanner isEnterprise={isEnterprise} coreCount={coreCount} />
          <KubeCostMetrics kubeCostData={kubeCostData.data} timeConfig={finalTimeConfig} cluster={cluster} />
        </>
      ) : (
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
      )}
    </>
  );
}
