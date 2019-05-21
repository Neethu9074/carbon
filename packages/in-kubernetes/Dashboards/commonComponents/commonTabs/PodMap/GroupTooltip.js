import React from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';
import Delayed from 'in-new-components/Delayed/Delayed';
import { getIconByPlugin } from 'in-kubernetes/icons';
import WithIcon from 'in-new-components/WithIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './PodTooltip.mless';

export default function DeplayedPodTooltip({ timeConfig, group, isMetricValuePresented }) {
  return (
    <Delayed waitingComponent={GroupTooltipComponent} group={group} isMetricValuePresented={isMetricValuePresented}>
      <GroupTooltip group={group} timeConfig={timeConfig} isMetricValuePresented={isMetricValuePresented} />
    </Delayed>
  );
}

const GroupTooltip = connectTo(
  ({ group, timeConfig }) => ({
    groupEntity: getSnapshot(group.data.id, timeConfig).filter(Boolean)
  }),
  GroupTooltipComponent
);

export function GroupTooltipComponent({ isMetricValuePresented, group, groupEntity }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.heading}>
        {groupEntity ? (
          <WithIcon icon={getIconByPlugin(groupEntity.get('plugin'))}>{getLabel(groupEntity)}</WithIcon>
        ) : (
          <Skeleton className={locals.metricValueSkeleton} />
        )}
      </div>
      <ul className={locals.list}>
        {!isMetricValuePresented && (
          <li className={locals.item}>
            <span className={locals.key}>Value</span>
            <span className={locals.value}>{group.data.valueLabel}</span>
          </li>
        )}

        <li className={locals.item}>
          <span className={locals.key}>Pods</span>
          {group.children.length}
        </li>
      </ul>
    </div>
  );
}
