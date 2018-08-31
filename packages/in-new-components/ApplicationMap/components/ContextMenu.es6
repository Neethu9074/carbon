import { get } from 'lodash';
import React from 'react';

import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getButtonKindBySeverity } from 'in-stores/events';
import Button from 'in-new-components/Button';

import locals from './ContextMenu.mless';

export default function ContextMenu({ node }) {
  const applicationId = get(node, ['data', 'applications', 0], '');
  const openIssues = get(node, ['data', 'numberOfOpenIssues'], 0);
  const maxSeverity = get(node, ['data', 'maxSeverity'], 0);

  return (
    <div className={locals.contextMenu}>
      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_views_stats"
        href$={getServiceDashboard(node.id, { applicationId })}
      >
        Go to Dashboard
      </Button>

      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_actions_flow_layout"
        href$={getServiceDashboard(node.id, { applicationId, tab: '/flowMap' })}
      >
        Go to Flowmap
      </Button>

      {openIssues > 0 && (
        <Button
          className={locals.button}
          kind={getButtonKindBySeverity(maxSeverity)}
          icon="lib_help_error_warning"
          href$={getEventsViewFilteredBy({ applicationId, serviceId: node.id, eventTypeFilter: 'issue' })}
        >
          {`Inspect ${openIssues} Issue${openIssues > 1 ? 's' : ''}`}
        </Button>
      )}
    </div>
  );
}
