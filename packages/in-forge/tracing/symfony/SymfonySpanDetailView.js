import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SymfonySpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Route">{span.getIn(['data', 'symfony', 'route'])}</Di>
        <Di title="Controller">{span.getIn(['data', 'symfony', 'controller'])}</Di>
        <Di title="Action">{span.getIn(['data', 'symfony', 'action'])}</Di>
        <Di title="Event Count">{span.getIn(['data', 'symfony', 'event_count'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'symfony', 'exception'])} />
      </Dl>
    </div>
  );
}
