/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function HzSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Operation">{span.getIn(['data', 'hbase', 'operation'])}</Di>
        <Di title="Table">{span.getIn(['data', 'hbase', 'table'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'hbase', 'error'])} />
      </Dl>
    </div>
  );
}
