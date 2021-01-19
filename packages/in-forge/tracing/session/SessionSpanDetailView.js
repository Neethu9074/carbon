/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SessionSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Session Handler">{span.getIn(['data', 'session', 'save_handler'])}</Di>
      </Dl>
    </div>
  );
}
