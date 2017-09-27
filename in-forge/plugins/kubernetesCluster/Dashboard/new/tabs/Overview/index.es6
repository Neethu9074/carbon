import React from 'react';

import ComponentStatuses from 'in-forge/plugins/kubernetesCluster/Dashboard/new/tabs/Overview/ComponentStatuses';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { number } from 'in-services/formatters/number';
import { emptySet } from 'in-services/fixedImmutables';
import { getLabel } from 'in-sdk/snapshot';

export default function Overview({ snapshot }) {
  return (
    <MaxWidthFullscreenContainer>
      <SnapshotLabel>{getLabel(snapshot)}</SnapshotLabel>

      <Kpis>
        <Kpi label="Deployments">
          {number.compact(snapshot.getIn(['data', 'deployments', 'itemIds'], emptySet).size)}
        </Kpi>
        <Kpi label="Pods">{number.compact(snapshot.getIn(['data', 'pods', 'itemIds'], emptySet).size)}</Kpi>
        <Kpi label="Replica Sets">
          {number.compact(snapshot.getIn(['data', 'replicaSets', 'itemIds'], emptySet).size)}
        </Kpi>
        <Kpi label="Replication Controllers">
          {number.compact(snapshot.getIn(['data', 'replicationControllers', 'itemIds'], emptySet).size)}
        </Kpi>
      </Kpis>

      <ComponentStatuses snapshot={snapshot} />
    </MaxWidthFullscreenContainer>
  );
}
