import React from 'react';

import getSnapshotFromHierarchyByPlugin from 'in-sdk/components/hoc/getSnapshotFromHierarchyByPlugin';
import {DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';
import {plugins} from 'in-forge/constants';

export default getSnapshotFromHierarchyByPlugin(plugins.process,
    function ProcessStartedAtDescriptionItem({processSnapshot}) {
  if (!processSnapshot) {
    return null;
  }

  return (
    <DescriptionItem title='Started At'>
      {formatDateTime(processSnapshot.getIn(['data', 'start']))}
    </DescriptionItem>
  );
});
