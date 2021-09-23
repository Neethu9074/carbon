/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesCluster from 'in-kubernetes/subscriptions/getKubernetesCluster';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    cluster: getKubernetesCluster({
      id: props.clusterId,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data : null))
  }),
  function ClusterBreadcrumb({ clusterId, cluster, href$ }) {
    const clusterDistribution = get(cluster, ['clusterDistribution'], 'kubernetes');
    const clusterIcon = `lib_${clusterDistribution}`;

    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={clusterId}
        render={healthInfo => (
          <Breadcrumb
            label={t('in-kubernetes:breadcrumbs.cluster')}
            icon={clusterIcon}
            href$={href$}
            healthInfo={healthInfo}
          >
            {cluster && cluster.label}
          </Breadcrumb>
        )}
      />
    );
  }
);
