/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ShellSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Shell Command">{span.getIn(['data', 'shell', 'cmd'])}</Di>
    </Dl>
  );
}
