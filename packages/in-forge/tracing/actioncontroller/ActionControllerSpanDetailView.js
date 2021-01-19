/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ActionControllerSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Controller">{span.getIn(['data', 'actioncontroller', 'controller'])}</Di>
      <Di title="Action">{span.getIn(['data', 'actioncontroller', 'action'])}</Di>
      <Di title="Error Message">{span.getIn(['data', 'log', 'message'])}</Di>
      <Di title="Error Type">{span.getIn(['data', 'log', 'parameters'])}</Di>
    </Dl>
  );
}
