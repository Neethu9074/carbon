/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import React from 'react';

import getKubernetesWorkloadControllerItemCounters from 'in-subscription/kubernetes/getKubernetesWorkloadControllerItemCounters';
import getKubernetesNamespaceItemCounters from 'in-subscription/kubernetes/getKubernetesNamespaceItemCounters';
import getKubernetesClusterItemCounters from 'in-subscription/kubernetes/getKubernetesClusterItemCounters';
import getKubernetesServiceItemCounters from 'in-subscription/kubernetes/getKubernetesServiceItemCounters';
import getKubernetesCronJobItemCounters from 'in-subscription/kubernetes/getKubernetesCronJobItemCounters';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import getKubernetesNodeItemCounters from 'in-subscription/kubernetes/getKubernetesNodeItemCounters';
import getKubernetesCronJob from 'in-subscription/kubernetes/getKubernetesCronJob';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import { pendingResult } from 'in-services/fixedObjects';

function observe(fn, obj) {
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
  const result = observe(getKubernetesClusterItemCounters, { clusterId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function NamespaceTab({ namespaceId, label, timeConfig, valueExtractor }) {
  const result = observe(getKubernetesNamespaceItemCounters, { namespaceId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function WorkloadTab({ workloadControllerId, label, timeConfig, valueExtractor }) {
  const result =
    observe(getKubernetesWorkloadControllerItemCounters, { workloadControllerId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function ServiceTab({ serviceId, label, timeConfig, valueExtractor }) {
  const result = observe(getKubernetesServiceItemCounters, { serviceId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={label} valueExtractor={valueExtractor} />;
}

export function NodePodTab({ nodeId, tab, timeConfig }) {
  const result = observe(getKubernetesNodeItemCounters, { nodeId, timeConfig });
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v.pods} />;
}

export function CronJobPodTab({ cronJobId, tab, timeConfig }) {
  const result = observe(getKubernetesCronJobItemCounters, { cronJobId, timeConfig });
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v.pods} />;
}

export function PodTab({ cronJobId, tab, timeConfig }) {
  const result = observe(getKubernetesCronJobItemCounters, { cronJobId, timeConfig });
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v.pods} />;
}

export function PodVolumesTab({ podId, tab, timeConfig }) {
  const result = observe(getKubernetesPod, { id: podId, timeConfig });
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.volumes} />;
}

export function PodConditionsTab({ podId, tab, timeConfig }) {
  const result = observe(getKubernetesPod, { id: podId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}

export function NodeConditionsTab({ nodeId, tab, timeConfig }) {
  const result = observe(getKubernetesNode, { id: nodeId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}

export function NodeVolumesTab({ nodeId, tab, timeConfig }) {
  const result = observe(getKubernetesNodeItemCounters, { nodeId, timeConfig });
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.volumes} />;
}

export function CronJobConditionsTab({ cronJobId, tab, timeConfig }) {
  const result = observe(getKubernetesCronJob, { id: cronJobId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}

export function DeploymentConfigConditionsTab({ deploymentConfigId, tab, timeConfig }) {
  const result = observe(getKubernetesWorkloadController, { id: deploymentConfigId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}

export function DeploymentConditionsTab({ deploymentId, tab, timeConfig }) {
  const result = observe(getKubernetesWorkloadController, { id: deploymentId, timeConfig }) ?? pendingResult;
  return <TabLabelWithCounter counters={result?.data} label={tab.label} valueExtractor={v => v?.conditions.length} />;
}
