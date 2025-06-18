/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import getKubernetesClusterItemCounters from 'in-kubernetes/subscriptions/getKubernetesClusterItemCounters';
import ComponentStatusTable from 'in-kubernetes/Dashboards/Cluster/tabs/ComponentStatusTable';
import Debugging from 'in-kubernetes/Dashboards/Cluster/tabs/Debugging';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-components/layout/Grid';

export default function Details({ data: cluster, timeConfig }) {
  const clusterId = cluster.id;
  const counters =
    useObservable(
      getKubernetesClusterItemCounters({ clusterId, timeConfig }),
      Object.values({ clusterId, timeConfig })
    ) ?? pendingResult;

  return (
    <>
      <Row>
        <Col lg={12}>
          <Debugging cluster={cluster} counters={counters?.data} />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ComponentStatusTable cluster={cluster} />
        </Col>
      </Row>
    </>
  );
}
