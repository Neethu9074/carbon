/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import { resourceQuotaBytes } from 'in-kubernetes/formatters';
import Skeleton from 'in-new-components/Loading/Skeleton';
import Delayed from 'in-new-components/Delayed/Delayed';
import MetricValue from 'in-components/MetricValue';
import WithIcon from 'in-new-components/WithIcon';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './PodTooltip.mless';

export default function DeplayedPodTooltip({ grouping, timeConfig, node }) {
  return (
    <Delayed waitingComponent={PodTooltipComponent} grouping={grouping} node={node}>
      <PodToolTip node={node} timeConfig={timeConfig} grouping={grouping} />
    </Delayed>
  );
}

const PodToolTip = connectTo(
  ({ node, timeConfig, grouping }) => ({
    pod: getKubernetesPod({
      id: node.data.id,
      timeConfig
    }).map(result => (result.data ? result.data : null)),
    groupEntity: grouping
      .getEntity({
        id: node.data.groupId,
        timeConfig
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
          {getGroupLabel(groupEntity, node)}
        </li>

        <li className={locals.item}>
          <span className={locals.key}>{t('in-kubernetes:dashboards.cpuRequests')}</span>
          {getMetricValue(node, 'cpuRequests')}
        </li>

        <li className={locals.item}>
          <span className={locals.key}>{t('in-kubernetes:dashboards.cpuLimitss')}</span>
          {getMetricValue(node, 'cpuLimits')}
        </li>

        <li className={locals.item}>
          <span className={locals.key}>{t('in-kubernetes:dashboards.memoryRequests')}</span>
          {getMetricValue(node, 'memoryRequests')}
        </li>

        <li className={locals.item}>
          <span className={locals.key}>{t('in-kubernetes:dashboards.memoryLimits')}</span>
          {getMetricValue(node, 'memoryLimits')}
        </li>

        <li className={locals.item}>
          <span className={locals.key}>{t('in-kubernetes:dashboards.container')}</span>
          {node.data.numberOfContainer}
        </li>
      </ul>
    </div>
  );
}

function getMetricValue(node, metricName) {
  if (node) {
    return (
      <MetricValue
        snapshotId={node.data.id}
        metric={metricName}
        formatter={resourceQuotaBytes}
        timeWindowAggregation="mean"
      />
    );
  }
  return <Skeleton className={locals.metricValueSkeleton} />;
}

function getPodLabel(pod, node) {
  if (pod) {
    return <span className={locals.headerLabel}>{get(pod, ['label'], node.data.id)}</span>;
  } else {
    return <Skeleton className={locals.labelSkeleton} />;
  }
}

function getGroupLabel(groupEntity, node) {
  if (groupEntity) {
    return (
      <span className={locals.value}>
        {get(
          groupEntity,
          ['name'],
          get(groupEntity, ['deployment', 'name'], get(groupEntity, ['label'], node.data.groupId))
        )}
      </span>
    );
  } else {
    if (node && node.data.groupId === 'unknown') {
      return 'Unknown';
    }
    return <Skeleton className={locals.labelSkeleton} />;
  }
}
