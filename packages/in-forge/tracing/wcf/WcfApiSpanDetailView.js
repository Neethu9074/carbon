/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function WebApiSpanDetailView({ span }) {
  const binding = span.getIn(['data', 'wcf', 'binding']);
  const error = span.getIn(['data', 'wcf', 'error']);

  return (
    <div>
      <Dl>
        <Di title="Service-Class">{span.getIn(['data', 'wcf', 'svcclass'])}</Di>
        <Di title="Action">{span.getIn(['data', 'wcf', 'svcmethod'])}</Di>
        <Di title="Binding">{binding ? binding : 'unknown'}</Di>
        <Di title="Url">{span.getIn(['data', 'wcf', 'localaddress'])}</Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
