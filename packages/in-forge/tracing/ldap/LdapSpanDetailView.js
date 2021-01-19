/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function LdapSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="URL">{span.getIn(['data', 'ldap', 'url'])}</Di>
        <Di title="Query">{span.getIn(['data', 'ldap', 'query'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'ldap', 'error'])} />
      </Dl>
    </div>
  );
}
