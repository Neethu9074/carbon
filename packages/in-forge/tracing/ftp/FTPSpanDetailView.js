/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function FTPSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Host">{span.getIn(['data', 'ftp', 'host'])}</Di>
        <Di title="Port">{span.getIn(['data', 'ftp', 'port'])}</Di>
        <Di title="Command">{span.getIn(['data', 'ftp', 'command'])}</Di>
        <Di title="Type">{span.getIn(['data', 'ftp', 'type'])}</Di>
        <Di title="File">{span.getIn(['data', 'ftp', 'file'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'ftp', 'error'])} />
      </Dl>
    </div>
  );
}
