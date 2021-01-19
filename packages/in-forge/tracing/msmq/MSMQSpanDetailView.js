/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function MSMQSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Machine">{span.getIn(['data', 'msmq', 'machineName'])}</Di>
        <Di title="Queue">{span.getIn(['data', 'msmq', 'queueName'])}</Di>
        <Di title="Operation">{span.getIn(['data', 'msmq', 'operation'])}</Di>
        <Di title="Transaction-Type">{span.getIn(['data', 'msmq', 'txType'])}</Di>
      </Dl>
    </div>
  );
}
