import React from 'react';

import TraceGroupsPage from 'in-analyze/Analyze/TraceGroups/TraceGroupsPage';
import { buildFilter } from 'in-analyze/Analyze/filterBuilder';
import TraceTablePage from 'in-analyze/TraceTablePage';

export default function Analyze(props) {
  const filter = buildFilter(props.location);
  return (
    <TraceTablePage {...props}>
      <TraceGroupsPage filter={filter} />
    </TraceTablePage>
  );
}
