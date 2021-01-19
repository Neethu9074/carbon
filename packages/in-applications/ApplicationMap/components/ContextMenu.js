/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import React from 'react';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import getApplication from 'in-subscription/application/getApplication';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { getButtonKindBySeverity } from 'in-stores/events';
import { boundaryScopes } from 'in-applications/constants';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './ContextMenu.mless';

export default connectTo(
  ({ applicationId, serviceLocatorUid }) => ({
    isTrafficEnabled: getServiceLocators(serviceLocatorUid).eventBusServiceLocator.on(SIGNALS.SHOW_EXTERNAL_TRAFFIC),
    application: getApplication({
      id: applicationId
    }).map(result => result.data)
  }),
  ContextMenuContent
);

export function ContextMenuContent({ applicationId, application, node, isTrafficEnabled }) {
  // when traffic is disabled, we only see services filtered by this applicaiton id, therefore we can straight use it.
  // if traffic is enabled, the user wants to break the border of the application, therefore don't use a context at all.
  if (isTrafficEnabled) {
    applicationId = null;
  }
  const openIssues = get(node, ['data', 'numberOfOpenIssues'], 0);
  const maxSeverity = get(node, ['data', 'maxSeverity'], 0);

  return (
    <div className={locals.contextMenu}>
      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_views_stats"
        href$={getServiceDashboard(node.id, {
          applicationId,
          boundaryScope: boundaryScopes.all
        })}
      >
        Go to Dashboard
      </Button>

      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_actions_flow_layout"
        href$={getServiceDashboard(node.id, { applicationId, boundaryScope: boundaryScopes.all, tab: '/flowMap' })}
      >
        Go to Flow
      </Button>

      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_analyze"
        href$={getLinkToAnalyze({
          applicationName: !application || isTrafficEnabled ? null : application.label,
          serviceName: node.data.label,
          // the dependency map shows services using all calls of the application
          // so link to Analyze should always use boundaryScopes.all
          boundaryScope: boundaryScopes.all,
          dataSource: 'calls',
          groupByTag: getConfigByDataSource('calls').defaultGrouping
        })}
      >
        Go to Analytics
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
