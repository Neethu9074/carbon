import React from 'react';

import TraceGroupsPage from 'in-analyze/GroupedTraces/TraceGroupsPage';
import { buildFilter } from 'in-analyze/shared/filterBuilder';
import TraceTablePage from 'in-analyze/shared/TraceTablePage';

export default function GroupedTraces(props) {
  const filter = buildFilter(props.location);
  return (
    <TraceTablePage {...props}>
      <TraceGroupsPage filter={filter} />
    </TraceTablePage>
  );
}
