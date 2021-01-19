/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function MuleClientSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Protocol">{span.getIn(['data', 'mule', 'protocol'])}</Di>
        <Di title="Address">{span.getIn(['data', 'mule', 'address'])}</Di>
        <Di title="Pattern">{span.getIn(['data', 'mule', 'pattern'])}</Di>
      </Dl>
    </div>
  );
}
