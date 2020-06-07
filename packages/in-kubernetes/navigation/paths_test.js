/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { setHighlightedEntityId } from 'in-services/stores/highlightedEntityId';
import { getDashboardForEntity } from 'in-kubernetes/navigation/paths';
import { setSelectedSnapshotId } from 'in-stores/snapshot';
import { fullyQualifiedPlugins } from 'in-forge/constants';

describe('in-kubernetes/navigation/paths', () => {
  beforeEach(() => {
    setSelectedSnapshotId(null);
    setHighlightedEntityId(null);
  });

  it('should return the correct link for an event on a pod', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = fullyQualifiedPlugins.kubernetesPod;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);

    pathShouldStartWith(subscriber.getCall(0).args[0], '/#/kubernetes/pod;podId=47_wi4IoJojdvsh1f3ebmi7DHII/summary');
  });

  it('should return the correct link for an event on a service', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = fullyQualifiedPlugins.kubernetesService;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/service;serviceId=47_wi4IoJojdvsh1f3ebmi7DHII/summary'
    );
  });

  it('should return the correct link for an event on a deployment', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = fullyQualifiedPlugins.kubernetesDeployment;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/deployment;deploymentId=47_wi4IoJojdvsh1f3ebmi7DHII/summary'
    );
  });

  it('should return the correct link for an event on a deploymentConfig', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = fullyQualifiedPlugins.openshiftDeploymentConfig;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/deploymentconfig;deploymentConfigId=47_wi4IoJojdvsh1f3ebmi7DHII/summary'
    );
  });

  it('should return the correct link for an event on a daemonSet', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = fullyQualifiedPlugins.kubernetesDaemonSet;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/daemonset;daemonSetId=47_wi4IoJojdvsh1f3ebmi7DHII/summary'
    );
  });

  it('should return the correct link for an event on a namespace', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = fullyQualifiedPlugins.kubernetesNamespace;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/namespace;namespaceId=47_wi4IoJojdvsh1f3ebmi7DHII/summary'
    );
  });

  it('should return the correct link for an event on a cluster', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = fullyQualifiedPlugins.kubernetesCluster;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/cluster;clusterId=47_wi4IoJojdvsh1f3ebmi7DHII/summary'
    );
  });
});

function pathShouldStartWith(path, starter) {
  expect(path.indexOf(starter)).to.not.equal(-1);
}
