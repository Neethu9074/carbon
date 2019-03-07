/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { setHighlightedEntityId } from 'in-services/stores/highlightedEntityId';
import { setFocusedMoment } from 'in-components/timeline/timelineStore';
import { getDashboardForEntity } from 'in-kubernetes/navigation/paths';
import { kubernetesPlugins } from 'in-kubernetes/constants';
import { setSelectedSnapshotId } from 'in-stores/snapshot';

describe('in-kubernetes/navigation/paths', () => {
  beforeEach(() => {
    setFocusedMoment(null);
    setSelectedSnapshotId(null);
    setHighlightedEntityId(null);
  });

  it('should return the correct link for an event on a pod', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = kubernetesPlugins.pod;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);

    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/pod;podId=47_wi4IoJojdvsh1f3ebmi7DHII/summary?timeline.to&timeline.ws=600000'
    );
  });

  it('should return the correct link for an event on a service', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = kubernetesPlugins.service;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/service;serviceId=47_wi4IoJojdvsh1f3ebmi7DHII/summary?timeline.to&timeline.ws=600000'
    );
  });

  it('should return the correct link for an event on a deployment', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = kubernetesPlugins.deployment;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/deployment;deploymentId=47_wi4IoJojdvsh1f3ebmi7DHII/summary?timeline.to&timeline.ws=600000'
    );
  });

  it('should return the correct link for an event on a namespace', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = kubernetesPlugins.namespace;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/namespace;namespaceId=47_wi4IoJojdvsh1f3ebmi7DHII/summary?timeline.to&timeline.ws=600000'
    );
  });

  it('should return the correct link for an event on a cluster', () => {
    const snapshotId = '47_wi4IoJojdvsh1f3ebmi7DHII';
    const plugin = kubernetesPlugins.cluster;
    const subscriber = sinon.stub();

    getDashboardForEntity(snapshotId, plugin).subscribe(subscriber);

    expect(subscriber.callCount).to.equal(1);
    pathShouldStartWith(
      subscriber.getCall(0).args[0],
      '/#/kubernetes/cluster;clusterId=47_wi4IoJojdvsh1f3ebmi7DHII/summary?timeline.to&timeline.ws=600000'
    );
  });
});

function pathShouldStartWith(path, starter) {
  expect(path.indexOf(starter)).to.not.equal(-1);
}
