import React from 'react';

import getRevisionForGoogleCloudRunServiceRevisionInstance from 'in-subscription/getRevisionForGoogleCloudRunServiceRevisionInstance';
import getProcessForGoogleCloudRunServiceRevisionInstance from 'in-subscription/getProcessForGoogleCloudRunServiceRevisionInstance';
import LinkToRelatedEntity from 'in-forge/plugins/googleCloudRunServiceRevisionInstance/Dashboard/LinkToRelatedEntity';

export default function GoogleCloudRunServiceRevisionInstanceDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <>
      <LinkToRelatedEntity
        snapshotId={snapshotId}
        subscription={getProcessForGoogleCloudRunServiceRevisionInstance}
        title="Process in Instance Container"
        description="More ore details for this Google Cloud Run service revision instance can be found on its
          corresponding process dashboard:"
      />
      <LinkToRelatedEntity
        snapshotId={snapshotId}
        subscription={getRevisionForGoogleCloudRunServiceRevisionInstance}
        title="Cloud Run Revision"
        description="This is an instance of the following Google Cloud Run service revision:"
      />
    </>
  );
}
