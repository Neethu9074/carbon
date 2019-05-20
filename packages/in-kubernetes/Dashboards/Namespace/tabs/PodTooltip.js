import { get } from 'lodash';
import React from 'react';

import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Skeleton from 'in-new-components/Loading/Skeleton';
import MetricValue from 'in-components/MetricValue';
import WithIcon from 'in-new-components/WithIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './PodTooltip.mless';

export default connectTo(
  props => ({
    pod: getKubernetesPod({
      id: props.node.id,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data : null)),
    groupEntity: props.grouping
      .getEntity({
        id: props.node.data.groupId,
        timeConfig: props.timeConfig
      })
      .map(result => result.data)
  }),
  PodTooltipComponent
);

export function PodTooltipComponent({ grouping, pod, node, groupEntity }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.heading}>
        <WithIcon icon="lib_kubernetes_pod">{getPodLabel(pod, node)}</WithIcon>
      </div>
      <ul className={locals.list}>
        <li className={locals.item}>
          <span className={locals.key}>{grouping.label}</span>
          <span className={locals.value}>{getGroupLabel(groupEntity, node)}</span>
        </li>

        <li className={locals.item}>
          <span className={locals.key}>Memory Limits</span>
          {getMetricValue(node, 'memoryLimits')}
        </li>

        <li className={locals.item}>
          <span className={locals.key}>Memory Requests</span>
          {getMetricValue(node, 'memoryRequests')}
        </li>
      </ul>
    </div>
  );
}

function getMetricValue(node, metricName) {
  if (node) {
    return (
      <MetricValue
        snapshotId={node.id}
        metric={metricName}
        formatter={bytesTwoDecimalPlaces}
        timeWindowAggregation="mean"
      />
    );
  }
  return <Skeleton className={locals.metricValueSkeleton} />;
}

function getPodLabel(pod, node) {
  if (pod) {
    return <span className={locals.headerLabel}>{get(pod, ['label'], node.id)}</span>;
  } else {
    return <Skeleton className={locals.labelSkeleton} />;
  }
}

function getGroupLabel(groupEntity, node) {
  if (groupEntity) {
    return (
      <span className={locals.value}>
        {get(groupEntity, ['name'], get(groupEntity, ['deployment', 'name'], node.data.groupId))}
      </span>
    );
  } else {
    if (node && node.data.groupId === 'unknown') {
      return 'Unknown';
    }
    return <Skeleton className={locals.labelSkeleton} />;
  }
}
