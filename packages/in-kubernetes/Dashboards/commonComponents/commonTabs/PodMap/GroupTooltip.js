/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { fromJS } from 'immutable';
import { t } from 'in-i18n';
import React from 'react';

import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import Skeleton from 'in-new-components/Loading/Skeleton';
import Delayed from 'in-new-components/Delayed/Delayed';
import WithIcon from 'in-new-components/WithIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './PodTooltip.mless';

export default function DeplayedGroupTooltip(props) {
  if (props.group.data.id === 'unknown') {
    return (
      <GroupTooltipComponent
        {...props}
        groupEntity={fromJS({
          label: t('in-kubernetes:dashboards.unknown'),
          plugin: getPlugin(props.grouping)
        })}
      />
    );
  }

  return (
    <Delayed waitingComponent={GroupTooltipComponent} {...props}>
      <GroupTooltip {...props} />
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
          <WithIcon icon={getIconType(groupEntity.get('plugin'))}>{getLabel(groupEntity)}</WithIcon>
        ) : (
          <Skeleton className={locals.metricValueSkeleton} />
        )}
      </div>
      <ul className={locals.list}>
        {!isMetricValuePresented && (
          <li className={locals.item}>
            <span className={locals.key}>{t('in-kubernetes:dashboards.value')}</span>
            <span className={locals.value}>{group.data.valueLabel}</span>
          </li>
        )}

        <li className={locals.item}>
          <span className={locals.key}>{t('in-kubernetes:dashboards.pods')}</span>
          {group.children.length}
        </li>
      </ul>
    </div>
  );
}

function getPlugin(grouping) {
  if (grouping.value === 'SERVICE') {
    return 'kubernetesService';
  }
  if (grouping.value === 'DEPLOYMENT') {
    return plugins.kubernetesDeployment;
  }
  if (grouping.value === 'NODE') {
    return plugins.kubernetesNode;
  }
  if (grouping.value === 'NAMESPACE') {
    return plugins.kubernetesNamespace;
  }
}
