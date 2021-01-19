/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ActionViewSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Error Message">{span.getIn(['data', 'log', 'message'])}</Di>
      <Di title="Error Type">{span.getIn(['data', 'log', 'parameters'])}</Di>
    </Dl>
  );
}
