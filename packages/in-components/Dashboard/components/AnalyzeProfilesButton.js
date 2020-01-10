import React from 'react';

import getProfilesAvailable from 'in-profiling/subscriptions/getProfilesAvailable';
import { getLinkToProfiles } from 'in-profiling/navigation/paths';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ processSnapshotId, timeConfig }) => ({
  profilesAvailable: getProfilesAvailable({
    processSnapshotId,
    timeConfig
  }).map(result => result.data && result.data.containsProfiles)
}))(function AnalyzeProfilesButton({ profilesAvailable, processSnapshotId }) {
  if (!profilesAvailable) {
    return null;
  }

  return (
    <Button
      kind="primary"
      icon="lib_application_trace"
      href$={getLinkToProfiles({
        processSnapshotId
      })}
    >
      Analyze Profiles
    </Button>
  );
});
