/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

import getKubernetesIdsForBreadcrumb$ from 'in-kubernetes/subscriptions/getKubernetesIdsForBreadcrumb';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    resolvedIdsResult: getKubernetesIdsForBreadcrumb$({
      filter: {
        daemonSetId: props.daemonSetId,
        deploymentId: props.deploymentId,
        deploymentConfigId: props.deploymentConfigId,
        namespaceId: props.namespaceId,
        clusterId: props.clusterId,
        serviceId: props.serviceId,
        nodeId: props.nodeId,
        persistentVolumeId: props.persistentVolumeId,
        persistentVolumeClaimId: props.persistentVolumeClaimId,
        podId: props.podId,
        statefulSetId: props.statefulSetId,
        cronJobId: props.cronJobId,
        timeConfig: props.timeConfig
      }
    })
  }),
  function KubernetesIdsForBreadcrumb(props) {
    return props.renderBreadcrumbs(
      get(props.resolvedIdsResult, ['data', 'clusterId']),
      get(props.resolvedIdsResult, ['data', 'namespaceId']),
      get(props.resolvedIdsResult, ['data', 'workloadControllerId']),
      get(props.resolvedIdsResult, ['data', 'workloadControllerType'])
    );
  }
);
