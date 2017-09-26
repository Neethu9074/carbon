import React from 'react';

import DualValueBar from 'in-sdk/components/dashboard/summary/DualValueBar';
import { agentNotificationsEnabled } from 'in-services/featureFlags';
import { emptyList, emptyMap } from 'in-services/fixedImmutables';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import KV from 'in-sdk/components/dashboard/KV';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    agentSnapshots: getSnapshotsInTimeframe('entity.selfType:agent')
  },
  function AgentViewKpis({ agentSnapshots }) {
    const agentNotifications = emptyMap;
    if (!agentSnapshots) {
      return null;
    }

    return (
      <Kpis>
        {agentSnapshots
          ? <KV
              k="Reporting agents"
              v={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {`${agentSnapshots.get('online', emptyList).size + agentSnapshots.get('offline', emptyList).size}`}
                  <DualValueBar
                    aValue={agentSnapshots.get('online', emptyList).size}
                    bValue={agentSnapshots.get('offline', emptyList).size}
                    formatter={b => b}
                    aLabel="Online"
                    bLabel="Offline"
                  />
                </div>
              }
            />
          : null}
        {agentNotificationsEnabled ? <KV k="Notifications" v={agentNotifications.size} /> : null}
      </Kpis>
    );
  }
);
