import React from 'react';

import EntityInformation from 'in-components/EntityInformation';
import { getServiceSideForOverview } from 'in-sdk/tracing';

export default function ServiceEntityInformation(props) {
  const { span } = props;
  const side = getServiceSideForOverview(span);
  const serviceSnapshotId = span.getIn(['rels', `${side}ServiceId`]);
  if (serviceSnapshotId) {
    return <EntityInformation {...props} entityId={serviceSnapshotId} time={span.get('start')} />;
  }
  return null;
}
