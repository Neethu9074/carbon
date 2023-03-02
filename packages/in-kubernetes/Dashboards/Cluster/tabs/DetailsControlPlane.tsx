/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, KeyValue } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error
import getKubernetesClusterItemCounters from 'in-kubernetes/subscriptions/getKubernetesClusterItemCounters';
// @ts-expect-error
import { clusterDashboardFullyQualified } from '../../../navigation/paths';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function DetailsControlPlane({ cluster, timeConfig }: any) {
  const clusterId = cluster.id;
  const counters: any =
    useObservable(
      getKubernetesClusterItemCounters({ clusterId, timeConfig }),
      Object.values({ clusterId, timeConfig })
    ) ?? pendingResult;
  const countersData = counters?.data;
  const debuggingInfo =
    cluster.debuggingInfo &&
    Object.keys(cluster.debuggingInfo).map(key => ({ key, value: cluster.debuggingInfo[key] }));

  if (countersData && countersData?.nodes != 0) {
    const coverageRatio = ((countersData.hosts / countersData.nodes) * 100).toFixed(1);
    const coverage = countersData.hosts + ' of ' + countersData.nodes + ' - ' + coverageRatio + '%';
    debuggingInfo.push({ key: 'Host Coverage', value: coverage });
  } else {
    debuggingInfo.push({ key: 'Host Coverage', value: '-' });
  }

  return (
    <Card title={t('in-kubernetes:dashboards.details')}>
      <DebugList items={debuggingInfo} clusterId={cluster.id} />
    </Card>
  );
}

function DebugList({ items, clusterId }: any) {
  if (!items || items.length === 0) {
    return <NoDataAvailable height={160} text={t('in-kubernetes:dashboards.noDebuggingInformation')} />;
  }
  const leaderObj = items.find((item: any) => item.key == 'Leader');
  const hostCoverageObj = items.find((item: any) => item.key == 'Host Coverage');
  const uuidObj = items.find((item: any) => item.key == 'UUID');
  const leaderValue = (
    <a href={`#${clusterDashboardFullyQualified};clusterId=` + clusterId + '/pods;pod.query=' + leaderObj.value}>
      {leaderObj.value}
    </a>
  );
  return (
    <Row>
      <Col lg={3} key={1}>
        <KeyValue value={hostCoverageObj.value} label={t('in-kubernetes:dashboards.hostCoverage')} accentuated />
      </Col>
      <Col lg={3} key={2}>
        <KeyValue value={uuidObj.value} label={t('in-kubernetes:dashboards.clusterUuid')} accentuated />
      </Col>
      <Col lg={3} key={3}>
        <KeyValue value={leaderValue} label={t('in-kubernetes:dashboards.agentMonitor')} accentuated />
      </Col>
    </Row>
  );
}
