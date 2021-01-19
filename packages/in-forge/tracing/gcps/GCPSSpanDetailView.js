/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function GCPSSpanDetailView({ span }) {
  const data = span.getIn(['data', 'gcps']),
    topic = data.get('top'),
    subscription = data.get('sub'),
    messageId = data.get('msgid');

  return (
    <Dl>
      <Di title="Operation">{data.get('op')}</Di>
      <Di title="Project ID">{data.get('projid')}</Di>
      {topic && <Di title="Topic">{data.get('top')}</Di>}
      {subscription && <Di title="Subscription">{subscription}</Di>}
      {messageId && <Di title="Message ID">{messageId}</Di>}
      <ErrorDescriptionItem error={data.get('error')} />
    </Dl>
  );
}
