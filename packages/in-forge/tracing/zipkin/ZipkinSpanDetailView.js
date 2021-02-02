/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { emptyMap } from 'in-services/fixedImmutables';

export default function ZipkinSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Service">{span.getIn(['data', 'service'])}</Di>
        <Di title="Operation">{span.getIn(['data', 'operation'])}</Di>
        <Di title="Tags" verticalDisplay>
          <Code code={JSON.stringify(span.getIn(['data', 'tags'], emptyMap).toJS(), 0, 2)} lang="json" />
        </Di>
      </Dl>
    </div>
  );
}
