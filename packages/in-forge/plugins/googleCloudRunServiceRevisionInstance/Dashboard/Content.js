/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getRevisionForGoogleCloudRunServiceRevisionInstance from 'in-subscription/getRevisionForGoogleCloudRunServiceRevisionInstance';
import getRuntimeForGoogleCloudRunServiceRevisionInstance from 'in-subscription/getRuntimeForGoogleCloudRunServiceRevisionInstance';
import LinkToRelatedEntity from 'in-forge/plugins/googleCloudRunServiceRevisionInstance/Dashboard/LinkToRelatedEntity';
import { t } from 'in-i18n';

export default function GoogleCloudRunServiceRevisionInstanceDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <>
      <LinkToRelatedEntity
        snapshotId={snapshotId}
        subscription={getRuntimeForGoogleCloudRunServiceRevisionInstance}
        title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.dashboard.runtimeInInstanceContainer')}
        description={t(
          'in-forge:plugins.googleCloudRunServiceRevisionInstance.dashboard.moreOreDetailsForThisGoogleCloudRunServiceRevisionInstanceCanBeFoundOnItsCorrespondingRuntimeDashboard'
        )}
      />
      <LinkToRelatedEntity
        snapshotId={snapshotId}
        subscription={getRevisionForGoogleCloudRunServiceRevisionInstance}
        title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.dashboard.cloudRunRevision')}
        description={t(
          'in-forge:plugins.googleCloudRunServiceRevisionInstance.dashboard.thisIsAnInstanceOfTheFollowingGoogleCloudRunServiceRevision'
        )}
      />
    </>
  );
}
