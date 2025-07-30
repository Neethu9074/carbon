/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';

// @ts-expect-error
import { setHighlightedEntityId } from 'in-map/stores/highlightedEntityId';
// @ts-expect-error
import { setSelectedSnapshotId } from 'in-stores/snapshot';
import { useDashboardForEntity } from 'in-kubernetes/navigation/paths';
import { plugins } from 'in-forge/constants';

describe('in-kubernetes/navigation/paths', () => {
  beforeEach(() => {
    setSelectedSnapshotId(null);
    setHighlightedEntityId(null);
  });

  const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';

  it('should return the correct link for an event on a pod', () => {
    const plugin = plugins.kubernetesPod;

    const { result } = renderHook(() => useDashboardForEntity(snapshotId, plugin));
    const dashboardEntity = result.current;

    pathShouldStartWith(dashboardEntity, '/#/kubernetes/pod;podId=47_wi4IoJojdvsh1f3ebmi7DHII/summary');
  });

  it('should return the correct link for an event on a service', () => {
    const plugin = plugins.kubernetesService;

    const { result } = renderHook(() => useDashboardForEntity(snapshotId, plugin));
    const dashboardEntity = result.current;

    pathShouldStartWith(dashboardEntity, '/#/kubernetes/service;serviceId=47_wi4IoJojdvsh1f3ebmi7DHII/summary');
  });

  it('should return the correct link for an event on a deployment', () => {
    const plugin = plugins.kubernetesDeployment;

    const { result } = renderHook(() => useDashboardForEntity(snapshotId, plugin));
    const dashboardEntity = result.current;

    pathShouldStartWith(dashboardEntity, '/#/kubernetes/deployment;deploymentId=47_wi4IoJojdvsh1f3ebmi7DHII/summary');
  });

  it('should return the correct link for an event on a deploymentConfig', () => {
    const plugin = plugins.openshiftDeploymentConfig;

    const { result } = renderHook(() => useDashboardForEntity(snapshotId, plugin));
    const dashboardEntity = result.current;

    pathShouldStartWith(
      dashboardEntity,
      '/#/kubernetes/deploymentconfig;deploymentConfigId=47_wi4IoJojdvsh1f3ebmi7DHII/summary'
    );
  });

  it('should return the correct link for an event on a daemonSet', () => {
    const plugin = plugins.kubernetesDaemonSet;

    const { result } = renderHook(() => useDashboardForEntity(snapshotId, plugin));
    const dashboardEntity = result.current;

    pathShouldStartWith(dashboardEntity, '/#/kubernetes/daemonset;daemonSetId=47_wi4IoJojdvsh1f3ebmi7DHII/summary');
  });

  it('should return the correct link for an event on a daemonSet', () => {
    const plugin = plugins.kubernetesStatefulSet;

    const { result } = renderHook(() => useDashboardForEntity(snapshotId, plugin));
    const dashboardEntity = result.current;

    pathShouldStartWith(dashboardEntity, '/#/kubernetes/statefulset;statefulSetId=47_wi4IoJojdvsh1f3ebmi7DHII/summary');
  });

  it('should return the correct link for an event on a namespace', () => {
    const plugin = plugins.kubernetesNamespace;

    const { result } = renderHook(() => useDashboardForEntity(snapshotId, plugin));
    const dashboardEntity = result.current;

    pathShouldStartWith(dashboardEntity, '/#/kubernetes/namespace;namespaceId=47_wi4IoJojdvsh1f3ebmi7DHII/summary');
  });

  it('should return the correct link for an event on a cluster', () => {
    const plugin = plugins.kubernetesCluster;

    const { result } = renderHook(() => useDashboardForEntity(snapshotId, plugin));
    const dashboardEntity = result.current;

    pathShouldStartWith(dashboardEntity, '/#/kubernetes/cluster;clusterId=47_wi4IoJojdvsh1f3ebmi7DHII/summary');
  });
});

function pathShouldStartWith(path: string | null, starter: string) {
  if (path === null) {
    return;
  }

  expect(path.indexOf(starter)).to.not.equal(-1);
}
