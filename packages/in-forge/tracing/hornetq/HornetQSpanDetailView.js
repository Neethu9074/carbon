/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function HornetQSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Address">{span.getIn(['data', 'hornetq', 'address'])}</Di>
        <Di title="User ID">{span.getIn(['data', 'hornetq', 'userId'])}</Di>
        <Di title="Size">{span.getIn(['data', 'hornetq', 'size'])}</Di>
        <Di title="Large">{span.getIn(['data', 'hornetq', 'large'])}</Di>
        <Di title="Durable">{span.getIn(['data', 'hornetq', 'durable'])}</Di>
        <Di title="Blocking">{span.getIn(['data', 'hornetq', 'blocking'])}</Di>
      </Dl>
    </div>
  );
}
