/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function LogSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Level">{span.getIn(['data', 'log', 'level'])}</Di>
      <Di title="Logger">{span.getIn(['data', 'log', 'logger'])}</Di>
      <Di title="Message">{span.getIn(['data', 'log', 'message'])}</Di>
      <Di title="Parameters">{span.getIn(['data', 'log', 'parameters'])}</Di>
      <Di title="Thread">{span.getIn(['data', 'log', 'thread'])}</Di>
    </Dl>
  );
}
