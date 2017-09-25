import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer/MaxWidthFullscreenContainer';
import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import AgentNotificationsTable from 'in-views/agentView/components/AgentNotificationsTable';
import AgentsPresenceChart from 'in-views/agentView/components/AgentsPresenceChart';
import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import DualValueBar from 'in-sdk/components/dashboard/summary/DualValueBar';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { getAgentNotifications } from 'in-stores/agentNotification';
import AgentsTable from 'in-views/agentView/components/AgentsTable';
import { emptyList, emptyMap } from 'in-services/fixedImmutables';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import KV from 'in-sdk/components/dashboard/KV';
import connectTo from 'in-hoc/connectTo';

import './AgentView.less';

const block = 'in-agent-view';

export default connectTo({
    agentSnapshots: getSnapshotsInTimeframe('entity.selfType:agent').startWith(emptyMap),
    agentNotifications: getAgentNotifications().startWith(emptyList)
  },
  function AgentView({ agentSnapshots, agentNotifications }) {
    return (
      <FullscreenOverlayView>
        <MaxWidthFullscreenContainer>
          <div className={block}>
            {DashboardNavigationRoute}

            <FullscreenViewHeading iconType="agent">Agents and Notifications</FullscreenViewHeading>

            <Kpis>
              {agentSnapshots ?
                <KV k="Reporting agents" v={
                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {`${agentSnapshots.get('online', emptyList).size + agentSnapshots.get('offline', emptyList).size}`}
                    <DualValueBar aValue={agentSnapshots.get('online', emptyList).size} bValue={agentSnapshots.get('offline', emptyList).size} formatter={b => b} aLabel="Online" bLabel="Offline" />
                  </div>} />
                : null }
                <KV k="Notifications" v={agentNotifications.size} />
            </Kpis>

            <AgentsPresenceChart />
            <AgentsTable />
            <AgentNotificationsTable />
          </div>
        </MaxWidthFullscreenContainer>
      </FullscreenOverlayView>
    );
  }
);
