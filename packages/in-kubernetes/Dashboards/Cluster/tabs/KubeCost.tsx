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
import TotalCostList from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/TotalCostList';
import NamespaceCost from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/NameSpaceCost';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ArticleContent from 'in-components/ArticleContent';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface SummaryProps {
  data: KubernetesCluster;
  timeConfig: TimeConfig;
}

export default function KubeCost({ timeConfig, data: cluster }: SummaryProps) {
  const id = cluster.id;
  const namespaceEndpoints =
    useObservable(
      () =>
        getRelatedResourcesForKubeCost({
          id,
          timeConfig
        }),
      []
    ) ?? pendingResult;

  const { loading } = namespaceEndpoints.progress;

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    !loading &&
    (namespaceEndpoints.data ? (
      <>
        <Row>
          <Col lg={12}>
            <TotalCostList
              currencyCode={namespaceEndpoints.data.currencyCode}
              snapshotId={namespaceEndpoints.data.id}
              timeConfig={timeConfig}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <NamespaceCost
              currencyCode={namespaceEndpoints.data.currencyCode}
              snapshotId={namespaceEndpoints.data.id}
              timeConfig={timeConfig}
            />
          </Col>
        </Row>
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
    ))
  );
}
