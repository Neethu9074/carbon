/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ZendFrameworkSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Route">{span.getIn(['data', 'zf', 'route'])}</Di>
        <Di title="Module">{span.getIn(['data', 'zf', 'module'])}</Di>
        <Di title="Controller">{span.getIn(['data', 'zf', 'controller'])}</Di>
        <Di title="Action">{span.getIn(['data', 'zf', 'action'])}</Di>
      </Dl>
    </div>
  );
}
