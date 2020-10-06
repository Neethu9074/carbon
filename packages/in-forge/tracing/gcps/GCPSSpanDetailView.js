import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function GCPSSpanDetailView({ span }) {
  const googleCloudPubSub = span.getIn(['data', 'gcps']);
  const subscription = googleCloudPubSub.get('sub');

  return (
    <Dl>
      <Di title="Operation">{googleCloudPubSub.get('op')}</Di>
      <Di title="Project ID">{googleCloudPubSub.get('projid')}</Di>
      <Di title="Topic">{googleCloudPubSub.get('top')}</Di>
      {subscription && <Di title="Subscription">{subscription}</Di>}
      <ErrorDescriptionItem error={googleCloudPubSub.get('error')} />
    </Dl>
  );
}
