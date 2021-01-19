/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function RenderSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Type">{span.getIn(['data', 'render', 'type'])}</Di>
      <Di title="Name">{span.getIn(['data', 'render', 'name'])}</Di>
      <Di title="Error Message">{span.getIn(['data', 'log', 'message'])}</Di>
      <Di title="Error Type">{span.getIn(['data', 'log', 'parameters'])}</Di>
    </Dl>
  );
}
