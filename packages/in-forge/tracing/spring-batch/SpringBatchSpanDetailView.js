import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SpringBatchSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Job">{span.getIn(['data', 'batch', 'job'])}</Di>
        <Di title="Parameters">{span.getIn(['data', 'batch', 'parameters'])}</Di>
        <Di title="Exit Status">{span.getIn(['data', 'batch', 'status'])}</Di>
      </Dl>
    </div>
  );
}
