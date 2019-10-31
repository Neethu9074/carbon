import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function GlassfishSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Scheduled Task">{span.getIn(['data', 'ejb', 'schedule', 'id'])}</Di>
      </Dl>
    </div>
  );
}
