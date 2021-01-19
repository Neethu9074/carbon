/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function WebApiSpanDetailView({ span }) {
  const binding = span.getIn(['data', 'wcfclient', 'binding']);
  const oneway = span.getIn(['data', 'wcfclient', 'oneway']);
  const channeltype = span.getIn(['data', 'wcfclient', 'channel']);
  const error = span.getIn(['data', 'wcfclient', 'error']);

  return (
    <div>
      <Dl>
        <Di title="Url">{span.getIn(['data', 'wcfclient', 'url'])}</Di>
        <Di title="Contract-Type">{span.getIn(['data', 'wcfclient', 'service'])}</Di>
        <Di title="Method">{span.getIn(['data', 'wcfclient', 'method'])}</Di>
        <Di title="Binding">{binding ? binding : 'unknown'}</Di>
        <Di title="Oneway">{oneway ? oneway : 'no'}</Di>
        <Di title="Channel">{channeltype ? channeltype : 'unknown'}</Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
