/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SdkSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Captured Arguments">{span.getIn(['data', 'sdk', 'arguments'])}</Di>
        <Di title="Captured Return Value">{span.getIn(['data', 'sdk', 'return'])}</Di>
        <Di title="Exception">{span.getIn(['data', 'sdk', 'exception'])}</Di>
      </Dl>
    </div>
  );
}
