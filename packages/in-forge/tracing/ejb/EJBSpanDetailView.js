/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function EJBSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Module">{span.getIn(['data', 'ejb', 'module'])}</Di>
      <Di title="App">{span.getIn(['data', 'ejb', 'app'])}</Di>
      <Di title="Bean">{span.getIn(['data', 'ejb', 'bean'])}</Di>
      <Di title="Method">{span.getIn(['data', 'ejb', 'method'])}</Di>
      <Di title="Node">{span.getIn(['data', 'ejb', 'node'])}</Di>
      <Di title="Id">{span.getIn(['data', 'ejb', 'id'])}</Di>
      <Di title="Connection">{span.getIn(['data', 'ejb', 'connection'])}</Di>
      <Di title="Result">{span.getIn(['data', 'ejb', 'result'])}</Di>
      <Di title="Type">{span.getIn(['data', 'ejb', 'sort'])}</Di>
      <Di title="Error">{span.getIn(['data', 'ejb', 'error'])}</Di>
    </Dl>
  );
}
