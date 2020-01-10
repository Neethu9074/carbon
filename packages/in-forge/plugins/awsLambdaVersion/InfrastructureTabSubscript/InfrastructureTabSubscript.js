import React from 'react';

import getRegionForAwsLambdaVersion from 'in-subscription/getRegionForAwsLambdaVersion';
import getLambdaFunctionForVersion from 'in-subscription/getLambdaFunctionForVersion';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { alwaysNull } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './InfrastructureTabSubscript.mless';

export default connectTo(
  ({ snapshot, time }) => {
    if (!snapshot || !snapshot.get('id')) {
      return {
        awsLambdaFunction: alwaysNull,
        regionSnapshotId: alwaysNull
      };
    }
    // load Lambda function entity and region
    return {
      awsLambdaFunctionSnapshotId: getLambdaFunctionForVersion({
        snapshotId: snapshot.get('id'),
        timeConfig: getTimeConfigAtMoment(time)
      }),
      regionSnapshotId: getRegionForAwsLambdaVersion({
        snapshotId: snapshot.get('id'),
        timeConfig: getTimeConfigAtMoment(time)
      })
    };
  },
  function InfrastructureTabSubscript({ snapshot, awsLambdaFunctionSnapshotId, regionSnapshotId }) {
    if (snapshot) {
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
    return null;
  }
);

function linkIfPossible(snapshotId, label) {
  if (snapshotId) {
    return <Link href$={subscriptLink(snapshotId)}>{label}</Link>;
  } else {
    return label;
  }
}

function subscriptLink(snapshotId) {
  return getDashboardLink(snapshotId, { pathname: '/physical/dashboard' });
}
