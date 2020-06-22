import React from 'react';

import getEcsTaskForEcsContainer from 'in-subscription/getEcsTaskForEcsContainer';
import getRegionForEcsContainer from 'in-subscription/getRegionForEcsContainer';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { alwaysNull } from 'in-services/fixedStreams';
import useObservable from 'in-hooks/useObservable';
import { shorten } from 'in-services/util/string';
import Link from 'in-components/Link';

import locals from './InfrastructureTabSubscript.mless';

const taskArnRegex = /^arn:aws:ecs:[^:]+:[^:]+:task\/([^:]+)/;
const clusterArnRegex = /^arn:aws:ecs:[^:]+:[^:]+:cluster\/([^:]+)/;

export default function InfrastructureTabSubscript({ snapshot, time }) {
  if (!snapshot) {
    return null;
  }

  const snapshotId = snapshot.get('id');

  const taskSnapshotId = useObservable(
    snapshotId
      ? getEcsTaskForEcsContainer({
          snapshotId: snapshotId,
          timeConfig: getTimeConfigAtMoment(time)
        })
      : alwaysNull,
    [snapshotId]
  );
  const regionSnapshotId = useObservable(
    snapshotId
      ? getRegionForEcsContainer({
          snapshotId: snapshotId,
          timeConfig: getTimeConfigAtMoment(time)
        })
      : alwaysNull,
    [snapshotId]
  );

  const data = snapshot.get('data');
  if (!data) {
    return null;
  }
  const taskArn = abbreviatePart(data, 'taskArn', taskArnRegex, 10);
  const taskDefinition = abbreviate(data.get('taskDefinition', '?'), 64);
  const taskDefinitionVersion = data.get('taskDefinitionVersion', '?');
  const clusterArn = abbreviatePart(data, 'clusterArn', clusterArnRegex, 32);
  const region = data.get('region', '?');
  const linkedTask = linkIfPossible(taskSnapshotId, taskArn);
  const linkedRegion = linkIfPossible(regionSnapshotId, region);
  return (
    <div className={locals.infrastructureTabSubscript}>
      in task {linkedTask} of definition {taskDefinition}:{taskDefinitionVersion}
      <br />
      on cluster {clusterArn} in region: {linkedRegion}
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

function linkIfPossible(snapshotId, label) {
  return snapshotId ? (
    <Link href$={subscriptLink(snapshotId)} className={locals.entityLink}>
      {label}
    </Link>
  ) : (
    label
  );
}

function subscriptLink(snapshotId) {
  return getDashboardLink(snapshotId, { pathname: '/physical/dashboard' });
}
