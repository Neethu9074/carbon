import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import TwoValueBar from 'in-new-components/TwoValueBar';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

import locals from './AgentViewKpis.mless';

export default function AgentViewKpis({ agentSnapshots }) {
  return (
    <div className={locals.row}>
      <KpiCard
        title="Total Agents"
        value={
          <div className={locals.value}>
            {`${agentSnapshots.get('online', emptyList).size + agentSnapshots.get('offline', emptyList).size}`}
            <div className={locals.twoValueBar}>
              <TwoValueBar
                v1={agentSnapshots.get('online', emptyList).size}
                v2={agentSnapshots.get('offline', emptyList).size}
                formatter={v => v}
                v1Label="Reporting"
                v2Label="Not reporting"
              />
            </div>
          </div>
        }
      />
    </div>
  );
}
