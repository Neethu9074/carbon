/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function WebApiSpanDetailView({ span }) {
  const controller = span.getIn(['data', 'webapi', 'controller']);
  const error = span.getIn(['data', 'webapi', 'error']);

  return (
    <div>
      <Dl>
        <Di title="Controller">{controller ? controller : 'unknown'}</Di>
        <Di title="Action">{span.getIn(['data', 'webapi', 'action'])}</Di>
        <Di title="Url">{span.getIn(['data', 'webapi', 'url'])}</Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
