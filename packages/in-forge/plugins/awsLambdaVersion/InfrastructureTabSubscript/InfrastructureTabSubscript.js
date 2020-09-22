import React from 'react';

import getRegionForAwsLambdaVersion from 'in-subscription/getRegionForAwsLambdaVersion';
import getLambdaFunctionForVersion from 'in-subscription/getLambdaFunctionForVersion';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { alwaysNull } from 'in-services/fixedStreams';
import useObservable from 'in-hooks/useObservable';
import Link from 'in-components/Link';

import locals from './InfrastructureTabSubscript.mless';

export default function InfrastructureTabSubscript({ snapshot, time }) {
  if (!snapshot) {
    return null;
  }

  const snapshotId = snapshot.get('id');

  const awsLambdaFunctionSnapshotId = useObservable(
    snapshotId
      ? getLambdaFunctionForVersion({
          snapshotId: snapshotId,
          timeConfig: getTimeConfigAtMoment(time)
        })
      : alwaysNull,
    [snapshotId, time]
  );
  const regionSnapshotId = useObservable(
    snapshotId
      ? getRegionForAwsLambdaVersion({
          snapshotId: snapshotId,
          timeConfig: getTimeConfigAtMoment(time)
        })
      : alwaysNull,
    [snapshotId, time]
  );

  const versionLabel = snapshot.getIn(['data', 'version'], '$LATEST');
  const functionName = snapshot.getIn(['data', 'name'], '?');
  const region = snapshot.getIn(['data', 'aws_grouping_zone'], '?');
  const versionComponent = linkIfPossible(snapshot.get('id'), versionLabel);
  const functionComponent = linkIfPossible(awsLambdaFunctionSnapshotId, functionName);
  const regionComponent = linkIfPossible(regionSnapshotId, region);
  return (
    <div className={locals.infrastructureTabSubscript}>
      version {versionComponent} of function {functionComponent} in region {regionComponent}
    </div>
  );
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
