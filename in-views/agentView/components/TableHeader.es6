import React from 'react';

import {
  agentViewLink$,
  isAgentViewLink$,
  agentNotificationsViewLink$,
  isAgentNotificationsViewLink$
} from 'in-stores/navigation/agents';
import { evaluateClassNames } from 'in-services/util/classnames';
import { emptyList } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './TableHeader.less';

const block = 'in-agent-view-table-header';

export default function TableHeader({ agentSnapshots, notifications }) {
  if (!agentSnapshots || !notifications) {
    return null;
  }

  const numAgents = agentSnapshots.get('online', emptyList).size + agentSnapshots.get('offline', emptyList).size;
  return (
    <div className={block}>
      <Tab title={`Agents (${numAgents})`} href$={agentViewLink$} isActive$={isAgentViewLink$} />
      <Tab
        title={`Notifications (${notifications.size})`}
        href$={agentNotificationsViewLink$}
        isActive$={isAgentNotificationsViewLink$}
      />
    </div>
  );
}

const Tab = connectTo(
  props => {
    return {
      isActive: props.isActive$
    };
  },
  function Tab({ title, href$, isActive }) {
    return (
      <Link href$={href$} className={`${block}__link`}>
        <div
          className={evaluateClassNames({
            [`${block}__tab`]: true,
            [`${block}__tab--selected`]: isActive
          })}
        >
          {title}
        </div>
      </Link>
    );
  }
);
