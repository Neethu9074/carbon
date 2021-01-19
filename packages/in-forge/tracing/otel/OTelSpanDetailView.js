/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { emptyMap } from 'in-services/fixedImmutables';

import locals from './OTelSpanDetailsView.mless';

export default function OTelSpanDetailView({ span }) {
  const error = span.getIn(['data', 'error']);
  const errorDetail = span.getIn(['data', 'error_detail']);
  const traceState = span.getIn(['data', 'trace_state']);

  return (
    <div>
      <Dl>
        <Di title="Service">{span.getIn(['data', 'service'])}</Di>
        <Di title="Operation">{span.getIn(['data', 'operation'])}</Di>
        {traceState != null && <Di title="Trace State">{traceState}</Di>}
        {error != null && (
          <Di title="Error" rowClassName={locals.error}>
            {error}
            {errorDetail != null && ` – ${errorDetail}`}
          </Di>
        )}
        <Di title="Tags" verticalDisplay>
          <Code code={JSON.stringify(span.getIn(['data', 'tags'], emptyMap).toJS(), 0, 2)} lang="json" />
        </Di>
      </Dl>
    </div>
  );
}
