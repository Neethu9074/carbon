import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function JavamailSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Address">{span.getIn(['data', 'mail', 'error'])}</Di>
      </Dl>
    </div>
  );
}
