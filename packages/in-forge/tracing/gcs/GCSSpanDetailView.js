import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function GCSSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Region">{span.getIn(['data', 'gcs', 'region'])}</Di>
        <Di title="Key">{span.getIn(['data', 'gcs', 'key'])}</Di>
      </Dl>
    </div>
  );
}
