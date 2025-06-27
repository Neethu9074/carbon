/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import getKubernetesWorkloadControllerItemCounters from 'in-kubernetes/subscriptions/getKubernetesWorkloadControllerItemCounters';
import getOtelKubernetesClusterItemCounters from 'in-kubernetes/subscriptions/getOtelKubernetesClusterItemCounters';
import getKubernetesNamespaceItemCounters from 'in-kubernetes/subscriptions/getKubernetesNamespaceItemCounters';
import getKubernetesClusterItemCounters from 'in-kubernetes/subscriptions/getKubernetesClusterItemCounters';
import getKubernetesServiceItemCounters from 'in-kubernetes/subscriptions/getKubernetesServiceItemCounters';
import getKubernetesCronJobItemCounters from 'in-kubernetes/subscriptions/getKubernetesCronJobItemCounters';
import getKubernetesWorkloadController from 'in-kubernetes/subscriptions/getKubernetesWorkloadController';
import getKubernetesNodeItemCounters from 'in-kubernetes/subscriptions/getKubernetesNodeItemCounters';
import getKubernetesCronJob from 'in-kubernetes/subscriptions/getKubernetesCronJob';
import getKubernetesNode from 'in-kubernetes/subscriptions/getKubernetesNode';
import getKubernetesPod from 'in-kubernetes/subscriptions/getKubernetesPod';
import { pendingResult } from 'in-services/fixedObjects';

function useObservableValues(fn, obj) {
  return useObservable(fn(obj), Object.values(obj));
}

export default function TabLabelWithCounter({ label, counters, valueExtractor }) {
  if (counters == null) {
    return <span>{label}</span>;
  }
  let count = valueExtractor(counters);

  return (
    <span>
      {label} ({count})
    </span>
  );
}

export function ClusterTab({ clusterId, label, timeConfig, valueExtractor }) {
  const result =
    useObservableValues(
      () => clusterId && getKubernetesClusterItemCounters({ clusterId, timeConfig }),
      [clusterId, timeConfig]
    ) ?? pendingResult;

  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function OtelClusterTab({ clusterId, label, timeConfig, valueExtractor }) {
  const result =
    useObservableValues(
      () => clusterId && getOtelKubernetesClusterItemCounters({ clusterId, timeConfig }),
      [clusterId, timeConfig]
    ) ?? pendingResult;

  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function NamespaceTab({ namespaceId, label, timeConfig, valueExtractor }) {
  const result =
    useObservableValues(
      () => namespaceId && getKubernetesNamespaceItemCounters({ namespaceId, timeConfig }),
      [namespaceId, timeConfig]
    ) ?? pendingResult;

  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function WorkloadTab({ workloadControllerId, label, timeConfig, valueExtractor }) {
  const result =
    useObservableValues(
      () => workloadControllerId && getKubernetesWorkloadControllerItemCounters({ workloadControllerId, timeConfig }),
      [workloadControllerId, timeConfig]
    ) ?? pendingResult;

  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function ServiceTab({ serviceId, label, timeConfig, valueExtractor }) {
  const result =
    useObservableValues(
      () => serviceId && getKubernetesServiceItemCounters({ serviceId, timeConfig }),
      [serviceId, timeConfig]
    ) ?? pendingResult;

  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function NodePodTab({ nodeId, tab, timeConfig }) {
  const result = useObservableValues(
    () => nodeId && getKubernetesNodeItemCounters({ nodeId, timeConfig }),
    [nodeId, timeConfig]
  );
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v.pods} />;
}

export function CronJobPodTab({ cronJobId, tab, timeConfig }) {
  const result = useObservableValues(
    () => cronJobId && getKubernetesCronJobItemCounters({ cronJobId, timeConfig }),
    [cronJobId, timeConfig]
  );
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v.pods} />;
}

export function PodTab({ cronJobId, tab, timeConfig }) {
  const result = useObservableValues(
    () => cronJobId && getKubernetesCronJobItemCounters({ cronJobId, timeConfig }),
    [cronJobId, timeConfig]
  );
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v.pods} />;
}

export function PodVolumesTab({ podId, tab, timeConfig }) {
  const result = useObservableValues(() => podId && getKubernetesPod({ id: podId, timeConfig }), [podId, timeConfig]);
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.volumes} />;
}

export function PodConditionsTab({ podId, tab, timeConfig }) {
  const result =
    useObservableValues(() => podId && getKubernetesPod({ id: podId, timeConfig }), [podId, timeConfig]) ??
    pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}

export function NodeConditionsTab({ nodeId, tab, timeConfig }) {
  const result =
    useObservableValues(() => nodeId && getKubernetesNode({ id: nodeId, timeConfig }), [nodeId, timeConfig]) ??
    pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}

export function NodeVolumesTab({ nodeId, tab, timeConfig }) {
  const result = useObservableValues(
    () => nodeId && getKubernetesNodeItemCounters({ nodeId, timeConfig }),
    [nodeId, timeConfig]
  );
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.volumes} />;
}

export function CronJobConditionsTab({ cronJobId, tab, timeConfig }) {
  const result =
    useObservableValues(
      () => cronJobId && getKubernetesCronJob({ id: cronJobId, timeConfig }),
      [cronJobId, timeConfig]
    ) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}

export function DeploymentConfigConditionsTab({ deploymentConfigId, tab, timeConfig }) {
  const result =
    useObservableValues(
      () => deploymentConfigId && getKubernetesWorkloadController({ id: deploymentConfigId, timeConfig }),
      [deploymentConfigId, timeConfig]
    ) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}

export function DeploymentConditionsTab({ deploymentId, tab, timeConfig }) {
  const result =
    useObservableValues(
      () => deploymentId && getKubernetesWorkloadController({ id: deploymentId, timeConfig }),
      [deploymentId, timeConfig]
    ) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}
