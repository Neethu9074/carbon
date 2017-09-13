import React from 'react';

import NotificationSeverity from 'in-views/agentView/components/NotificationSeverity';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getAgentNotifications } from 'in-stores/agentNotification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import { compare } from 'in-services/util/number';
import PluginIcon from 'in-components/PluginIcon';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';
import Link from 'in-components/Link';

import './AgentsTable.less';

const block = 'in-agent-view-table';

const cols = [
  {
    title: 'Notification',
    type: 'custom',
    typeArgs: {
      comparator: () => compareIgnoreCase,
      get(row) {
        const msg = row.agentNotification.getIn(['data', 'message']);
        return {
          value: msg,
          content: (
            <Link
              href$={getSubDashboardLink(`/notification/${row.agentNotification.get('id')}`)}
              className={`${block}__link`}
            >
              <PluginIcon
                className={`${block}__plugin-icon`}
                color="#000"
                dimension={12}
                plugin={row.agentNotification.getIn(['data', 'plugin'])}
              />
              {msg}
            </Link>
          )
        };
      }
    }
  },
  {
    title: 'Severity',
    type: 'custom',
    width: 80,
    typeArgs: {
      comparator: () => compare,
      get(row) {
        const severity = row.agentNotification.getIn(['data', 'severity']);
        return {
          value: severity,
          content: <NotificationSeverity severity={severity} />
        };
      }
    }
  }
];

export default connectTo(
  {
    agentNotifications: getAgentNotifications()
  },
  function AgentViewAgentsTable({ agentNotifications }) {
    if (!agentNotifications) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = agentNotifications.toArray().map(agentNotification => {
      return {
        key: agentNotification.get('id'),
        agentNotification
      };
    });
    return (
      <DashboardTile title={`Agent Notifications (${agentNotifications.size})`}>
        <Table maxItemsPerPage={10} cols={cols} rows={rows} initialSortColumn={1} />
      </DashboardTile>
    );
  }
);
