import React from 'react';

import { buildFilter } from 'in-analyze/shared/filterBuilder';
import RawTracesPage from 'in-analyze/RawTraces/RawTracesPage';
import TraceTablePage from 'in-analyze/shared/TraceTablePage';

export default function RawTraces(props) {
  const filter = buildFilter(props.location);
  return (
    <TraceTablePage {...props}>
      <RawTracesPage filter={filter} />
    </TraceTablePage>
  );
}
