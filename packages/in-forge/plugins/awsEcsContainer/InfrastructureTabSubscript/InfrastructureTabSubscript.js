import React from 'react';

import getEcsTaskForEcsContainer from 'in-subscription/getEcsTaskForEcsContainer';
import getRegionForEcsContainer from 'in-subscription/getRegionForEcsContainer';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
import { shorten } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './InfrastructureTabSubscript.mless';

const taskArnRegex = /^arn:aws:ecs:[^:]+:[^:]+:task\/([^:]+)/;
const clusterArnRegex = /^arn:aws:ecs:[^:]+:[^:]+:cluster\/([^:]+)/;

export default function InfrastructureTabSubscript({ snapshot, time }) {
  if (!snapshot) {
    return null;
  }

  const snapshotId = snapshot.get('id');
  const taskSnapshotId = useObservable(getEcsTaskForEcsContainerObservable, [snapshotId, time]);
  const regionSnapshotId = useObservable(getRegionForEcsContainerObservable, [snapshotId, time]);

  const data = snapshot.get('data');
  if (!data) {
    return null;
  }
  const taskArn = abbreviatePart(data, 'taskArn', taskArnRegex, 10);
  const taskDefinition = abbreviate(data.get('taskDefinition', '?'), 64);
  const taskDefinitionVersion = data.get('taskDefinitionVersion', '?');
  const clusterArn = abbreviatePart(data, 'clusterArn', clusterArnRegex, 32);
  const region = data.get('region', '?');
  const linkedTask = linkIfPossible(taskSnapshotId, taskArn, 'lib_aws_ecs_task');
  const linkedRegion = linkIfPossible(regionSnapshotId, region, 'lib_views_cloud');
  return (
    <div className={locals.infrastructureTabSubscript}>
      <div>
        <span>in </span>
        {linkedTask}
        <span> of </span>
        <Icon type="lib_aws_ecs_task_definition_version" />
        <span>
          {' '}
          {taskDefinition}:{taskDefinitionVersion}
        </span>
      </div>
      <div>
        <span> on </span>
        <Icon type="lib_aws_ecs_cluster" />
        <span>
          {' '}
          {clusterArn} in {linkedRegion}
        </span>
      </div>
    </div>
  );
}

function abbreviatePart(data, key, regex, length = 10) {
  let fullValue = data.get(key, '?');
  if (fullValue !== '?') {
    const match = regex.exec(fullValue);
    return withTooltip(fullValue, shorten(match?.[1] ?? fullValue, length));
  }
  return fullValue;
}

function abbreviate(fullLabel, length) {
  return withTooltip(fullLabel, shorten(fullLabel, length));
}

function withTooltip(fullLabel, abbreviation) {
  return <span title={fullLabel}>{abbreviation}</span>;
}

function linkIfPossible(snapshotId, label, icon) {
  return snapshotId ? (
    <>
      <Icon type={icon} />
      <Link href$={subscriptLink(snapshotId)} className={locals.entityLink}>
        {label}
      </Link>
    </>
  ) : (
    label
  );
}

function subscriptLink(snapshotId) {
  return getDashboardLink(snapshotId, { pathname: '/physical/dashboard' });
}

function Icon({ type }) {
  return <SvgIcon className={locals.entitiyIcon} type={type} size="s" />;
}

function getEcsTaskForEcsContainerObservable([snapshotId, time]) {
  return (
    snapshotId &&
    getEcsTaskForEcsContainer({
      snapshotId: snapshotId,
      timeConfig: getTimeConfigAtMoment(time)
    })
  );
}

function getRegionForEcsContainerObservable([snapshotId, time]) {
  return (
    snapshotId &&
    getRegionForEcsContainer({
      snapshotId: snapshotId,
      timeConfig: getTimeConfigAtMoment(time)
    })
  );
}
