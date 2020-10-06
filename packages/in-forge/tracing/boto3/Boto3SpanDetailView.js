import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { expandNestedSerializedJson } from 'in-services/util/json';
import Code from 'in-sdk/components/traceDetails/Code';

export default function Boto3SpanDetailView({ span }) {
  const payload = span.getIn(['data', 'boto3', 'payload']);

  return (
    <Dl>
      <Di title="Operation">{span.getIn(['data', 'boto3', 'op'])}</Di>
      <Di title="Endpoint">{span.getIn(['data', 'boto3', 'ep'])}</Di>
      <Di title="Region">{span.getIn(['data', 'boto3', 'reg'])}</Di>
      <Di title="Status">{span.getIn(['data', 'http', 'status'])}</Di>

      <Di title="Payload" verticalDisplay>
        <Code code={JSON.stringify(expandNestedSerializedJson(payload.toJS()), 0, 2)} lang="json" />
      </Di>

      <ErrorDescriptionItem error={span.getIn(['data', 'boto3', 'error'])} />
    </Dl>
  );
}
