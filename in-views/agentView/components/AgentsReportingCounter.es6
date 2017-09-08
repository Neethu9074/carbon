import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';

import './AgentsReportingCounter.less';

const block = 'in-agent-view-table-reporting-counter';

export default function AgentsReportingCounter({ agentSnapshots }) {
  if (!agentSnapshots) {
    return null;
  }

  return (
    <div className={block}>
      {`${agentSnapshots.get('online', emptyList).size} agents are reporting, ${agentSnapshots.get('offline', emptyList)
        .size} are not`}
    </div>
  );
}
