/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function LaminasSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Route">{span.getIn(['data', 'laminas', 'route'])}</Di>
        <Di title="Module">{span.getIn(['data', 'laminas', 'module'])}</Di>
        <Di title="Controller">{span.getIn(['data', 'laminas', 'controller'])}</Di>
        <Di title="Action">{span.getIn(['data', 'laminas', 'action'])}</Di>
      </Dl>
    </div>
  );
}
