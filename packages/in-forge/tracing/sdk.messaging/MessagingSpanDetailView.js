/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function MessagingSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Destination">{span.getIn(['data', 'messaging', 'destination'])}</Di>
      </Dl>
    </div>
  );
}
