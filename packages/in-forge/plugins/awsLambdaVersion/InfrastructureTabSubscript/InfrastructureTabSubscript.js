/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getRegionForAwsLambdaVersion from 'in-subscription/getRegionForAwsLambdaVersion';
import getLambdaFunctionForVersion from 'in-subscription/getLambdaFunctionForVersion';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
import Link from 'in-components/Link';
import { Trans, t } from 'in-i18n';

import locals from './InfrastructureTabSubscript.mless';

export default function InfrastructureTabSubscriptNullChecker(props) {
  if (!props.snapshot) {
    return null;
  }
  return <InfrastructureTabSubscript {...props} />;
}

function InfrastructureTabSubscript({ snapshot, time }) {
  const snapshotId = snapshot.get('id');
  const awsLambdaFunctionSnapshotId = useObservable(getLambdaFunctionForVersionObservable, [snapshotId, time]);
  const regionSnapshotId = useObservable(getRegionForAwsLambdaVersionObservable, [snapshotId, time]);

  const versionLabel = snapshot.getIn(['data', 'version'], '$LATEST');
  const functionName = snapshot.getIn(['data', 'name'], '?');
  const region = snapshot.getIn(['data', 'aws_grouping_zone'], '?');
  const subscriptText = getSubscriptionText(
    versionLabel,
    functionName,
    region,
    snapshotId,
    awsLambdaFunctionSnapshotId,
    regionSnapshotId
  );

  return <div className={locals.infrastructureTabSubscript}>{subscriptText}</div>;
}

function subscriptLink(snapshotId) {
  return getDashboardLink(snapshotId, { pathname: '/physical/dashboard' });
}

function getLambdaFunctionForVersionObservable([snapshotId, time]) {
  return (
    snapshotId &&
    getLambdaFunctionForVersion({
      snapshotId: snapshotId,
      timeConfig: getTimeConfigAtMoment(time)
    })
  );
}

function getRegionForAwsLambdaVersionObservable([snapshotId, time]) {
  return (
    snapshotId &&
    getRegionForAwsLambdaVersion({
      snapshotId: snapshotId,
      timeConfig: getTimeConfigAtMoment(time)
    })
  );
}

function getSubscriptionText(verLabel, funcName, region, verId, funcId, regionId) {
  let contextId = '';
  let components = {};

  if (verId) {
    contextId = 'VerId';
    components.versionLink = <Link href$={subscriptLink(verId)} className={locals.entityLink} />;
  }
  if (funcId) {
    contextId = contextId + 'FuncId';
    components.functionLink = <Link href$={subscriptLink(funcId)} className={locals.entityLink} />;
  }
  if (regionId) {
    contextId = contextId + 'RegionId';
    components.regionLink = <Link href$={subscriptLink(regionId)} className={locals.entityLink} />;
  }

  return verId || funcId || regionId ? (
    <Trans
      i18nKey="in-forge:plugins.awsLambdaVersion.subscript"
      tOptions={{ context: contextId }}
      values={{
        version: verLabel,
        function: funcName,
        region: region
      }}
      components={components}
    />
  ) : (
    t('in-forge:plugins.awsLambdaVersion.subscriptNonId', {
      version: verLabel,
      function: funcName,
      region: region
    })
  );
}
