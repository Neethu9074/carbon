/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function AkkaRemoteSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Path">{span.getIn(['data', 'akka', 'path'])}</Di>
      <Di title="Message">{span.getIn(['data', 'akka', 'msg'])}</Di>
    </Dl>
  );
}
