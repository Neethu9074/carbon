import { get } from 'lodash';
import React from 'react';

import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import WithIcon from 'in-new-components/WithIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './PodTooltip.mless';

export default connectTo(
  props => ({
    pod: getKubernetesPod({
      id: props.node.id,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data.pod : null)),
    groupEntity: props.grouping
      .getEntity({
        id: props.node.data.groupId,
        timeConfig: props.timeConfig
      })
      .map(result => result.data)
  }),
  function PodTooltip({ grouping, pod, node, groupEntity }) {
    return (
      <div className={locals.wrapper}>
        <div className={locals.heading}>
          <WithIcon icon="lib_kubernetes_pod">
            <span className={locals.headerLabel}>{get(pod, ['label'], node.id)}</span>
          </WithIcon>
        </div>
        <ul className={locals.list}>
          <KV
            k={grouping.label}
            v={get(groupEntity, ['name'], get(groupEntity, ['deployment', 'name'], node.data.groupId))}
          />
          <KV
            k="Memory Limits"
            v={
              <MetricValue
                snapshotId={node.id}
                metric="memoryLimits"
                formatter={bytesTwoDecimalPlaces}
                timeWindowAggregation="mean"
              />
            }
          />
          <KV
            k="Memory Requests"
            v={
              <MetricValue
                snapshotId={node.id}
                metric="memoryRequests"
                formatter={bytesTwoDecimalPlaces}
                timeWindowAggregation="mean"
              />
            }
          />
        </ul>
      </div>
    );
  }
);

function KV({ k, v }) {
  return (
    <li className={locals.item}>
      <span className={locals.key}>{k}</span>
      <span className={locals.value}>{v}</span>
    </li>
  );
}
