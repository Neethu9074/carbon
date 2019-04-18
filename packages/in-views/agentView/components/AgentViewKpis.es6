import React from 'react';

import { agentNotificationsEnabled } from 'in-services/featureFlags';
import { emptyList, emptyMap } from 'in-services/fixedImmutables';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { formatDateTime } from 'in-services/formatters/date';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import TwoValueBar from 'in-new-components/TwoValueBar';
import { timeConfig$ } from 'in-stores/time/config';
import KV from 'in-sdk/components/dashboard/KV';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './AgentViewKpis.mless';

export default connectTo(
  {
    agentSnapshots: getSnapshotsInTimeframe('entity.selfType:agent'),
    timeConfig: timeConfig$
  },
  function AgentViewKpis({ agentSnapshots, timeConfig }) {
    const agentNotifications = emptyMap;
    if (!agentSnapshots) {
      return null;
    }

    return (
      <Kpis>
        {agentSnapshots ? (
          <Tooltip
            content={`At the selected moment: ${
              timeConfig.focusedMoment ? formatDateTime(timeConfig.focusedMoment) : 'Now'
            }`}
            align="rightMiddle"
          >
            <KV
              k="Total agents"
              v={
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
          </Tooltip>
        ) : null}
        {agentNotificationsEnabled ? <KV k="Notifications" v={agentNotifications.size} /> : null}
      </Kpis>
    );
  }
);
