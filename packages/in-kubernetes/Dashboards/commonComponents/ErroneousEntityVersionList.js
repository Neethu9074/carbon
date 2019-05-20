import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import NotFoundDialog from 'in-components/Dashboard/components/NotFoundDialog';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { getSnapshotVersions } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './ErroneousEntityVersionList.mless';

export default connectTo(
  ({ snapshotId, timeConfig }) => ({
    versionsForFocusedMoment: getSnapshotVersions(snapshotId, timeConfig).startWith(null),
    versionsForLive: getSnapshotVersions(snapshotId, getTimeConfigAtMoment(null)).startWith(null)
  }),
  function ErroneousEntityVersionList({ errors, snapshotId, versionsForFocusedMoment, versionsForLive }) {
    if (
      versionsForFocusedMoment &&
      versionsForFocusedMoment.size === 0 &&
      versionsForLive &&
      versionsForLive.size === 0
    ) {
      return <ErroneousResultPresenter errors={errors} className={locals.error} />;
    }

    return (
      <div className={locals.notFoundDialog}>
        <NotFoundDialog
          snapshotId={snapshotId}
          versionsForFocusedMoment={versionsForFocusedMoment}
          versionsForLive={versionsForLive}
        />
      </div>
    );
  }
);
