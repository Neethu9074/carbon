import React from 'react';

import EntityInformation from 'in-components/EntityInformation';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { getServiceSideForOverview } from 'in-sdk/tracing';

export default function ServiceEntityInformation(props) {
  const { span } = props;
  const side = getServiceSideForOverview(span);
  const serviceSnapshotId = span.getIn(['rels', `${side}ServiceId`]);
  if (serviceSnapshotId) {
    return (
      <EntityInformation
        {...props}
        entityId={serviceSnapshotId}
        timeConfig={getTimeConfigAtMoment(span.get('start'))}
      />
    );
  }
  return null;
}
