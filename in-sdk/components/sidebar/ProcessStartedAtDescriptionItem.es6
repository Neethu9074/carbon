import React from 'react';

import getSnapshotFromHierarchyByPlugin from 'in-sdk/components/hoc/getSnapshotFromHierarchyByPlugin';
import {formatDateTime, fromNow} from 'in-services/formatters/date';
import {DescriptionItem} from 'in-components/DescriptionList';
import {plugins} from 'in-forge/constants';

export default getSnapshotFromHierarchyByPlugin(plugins.process,
    function ProcessStartedAtDescriptionItem({processSnapshot}) {
  if (!processSnapshot) {
    return null;
  }

  const start = processSnapshot.getIn(['data', 'start']);
  if (!start) {
    return null;
  }

  return (
    <DescriptionItem title='Started At'>
      {formatDateTime(start)} ({fromNow(start)})
    </DescriptionItem>
  );
});
