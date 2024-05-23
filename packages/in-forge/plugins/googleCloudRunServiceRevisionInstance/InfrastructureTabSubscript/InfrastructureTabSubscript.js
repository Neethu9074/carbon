/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import getRevisionForGoogleCloudRunServiceRevisionInstance from 'in-subscription/getRevisionForGoogleCloudRunServiceRevisionInstance';
import getRegionForGoogleCloudRunServiceRevisionInstance from 'in-subscription/getRegionForGoogleCloudRunServiceRevisionInstance';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { alwaysNull } from 'in-services/fixedStreams';
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
  const getDashboardLink = useGetDashboardLink();

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
  const revisionComponent = linkIfPossible(revisionSnapshotId, revision, getDashboardLink);
  const regionComponent = linkIfPossible(regionSnapshotId, region, getDashboardLink);
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

function linkIfPossible(snapshotId, label, getDashboardLink) {
  return snapshotId ? (
    <Link href={getDashboardLink(snapshotId, { pathname: '/physical/dashboard' })} className={locals.entityLink}>
      {label}
    </Link>
  ) : (
    label
  );
}
