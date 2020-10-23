import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function GCPSASpanDetailView({ span }) {
  const data = span.getIn(['data', 'gcpsa']),
    topic = data.get('top'),
    subscription = data.get('sub'),
    snapshot = data.get('snap');

  return (
    <Dl>
      <Di title="Operation">{data.get('op')}</Di>
      <Di title="Project ID">{data.get('projid')}</Di>
      {topic && <Di title="Topic">{data.get('top')}</Di>}
      {subscription && <Di title="Subscription">{subscription}</Di>}
      {snapshot && <Di title="Snapshot">{snapshot}</Di>}
      <ErrorDescriptionItem error={data.get('error')} />
    </Dl>
  );
}
