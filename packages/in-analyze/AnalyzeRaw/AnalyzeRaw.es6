import React from 'react';

import { buildFilter } from 'in-analyze/Analyze/filterBuilder';
import RawTraces from 'in-analyze/AnalyzeRaw/RawTraces';
import TraceTablePage from 'in-analyze/TraceTablePage';

export default function Analyze(props) {
  const filter = buildFilter(props.location);
  return (
    <TraceTablePage {...props}>
      <RawTraces filter={filter} />
    </TraceTablePage>
  );
}
