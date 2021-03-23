/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import React from 'react';

import getRevisionForGoogleCloudRunServiceRevisionInstance from 'in-subscription/getRevisionForGoogleCloudRunServiceRevisionInstance';
import getRegionForGoogleCloudRunServiceRevisionInstance from 'in-subscription/getRegionForGoogleCloudRunServiceRevisionInstance';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { alwaysNull } from 'in-services/fixedStreams';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './InfrastructureTabSubscript.mless';

export default function InfrastructureTabSubscriptNullChecker(props) {
  if (!props.snapshot) {
    return null;
  }
  return <InfrastructureTabSubscript {...props} />;
}

function InfrastructureTabSubscript({ snapshot, time }) {
  const snapshotId = snapshot.get('id');

  const revisionSnapshotId = useObservable(
    snapshotId
      ? getRevisionForGoogleCloudRunServiceRevisionInstance({
          snapshotId: snapshotId,
          timeConfig: getTimeConfigAtMoment(time)
        })
      : alwaysNull,
    [snapshotId, time]
  );
  const regionSnapshotId = useObservable(
    snapshotId
      ? getRegionForGoogleCloudRunServiceRevisionInstance({
          snapshotId: snapshotId,
          timeConfig: getTimeConfigAtMoment(time)
        })
      : alwaysNull,
    [snapshotId, time]
  );

  const revision = snapshot.getIn(['data', 'revision'], '?');
  const service = snapshot.getIn(['data', 'service'], '?');
  const region = snapshot.getIn(['data', 'region'], '?');
  const revisionComponent = linkIfPossible(revisionSnapshotId, revision);
  const regionComponent = linkIfPossible(regionSnapshotId, region);
  return (
    <div className={locals.infrastructureTabSubscript}>
      {t('in-forge:plugins.googleCloudRunServiceRevisionInstance.revisionOfServiceInRegion', {
        revisionComponent: revisionComponent,
        service: service,
        regionComponent: regionComponent
      })}
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
