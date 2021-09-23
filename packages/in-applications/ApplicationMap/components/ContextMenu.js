/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Button } from '@instana/components';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import { getLinkToAnalyze, getServiceDashboard } from 'in-applications/navigation/paths';
import { defaultGroupings as defaultApplicationGroupings } from 'in-applications/tags';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import getApplication from 'in-applications/subscriptions/getApplication';
import { getButtonKindBySeverity } from 'in-stores/events';
import { boundaryScopes } from 'in-applications/constants';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
        {t('in-applications:buttonGoToDashboard')}
      </Button>

      <Button
        className={locals.button}
        kind="subtle"
        icon="lib_actions_flow_layout"
        href$={getServiceDashboard(node.id, { applicationId, boundaryScope: boundaryScopes.all, tab: '/flowMap' })}
      >
        {t('in-applications:buttonGoToFlow')}
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
          groupBy: defaultApplicationGroupings.calls
        })}
      >
        {t('in-applications:buttonGoToAnalytics')}
      </Button>

      {openIssues > 0 && (
        <Button
          className={locals.button}
          kind={getButtonKindBySeverity(maxSeverity)}
          icon="lib_help_error_warning"
          href$={getEventsViewFilteredBy({ applicationId, serviceId: node.id, eventTypeFilter: 'issue' })}
        >
          {t('in-applications:buttonInspectIssue', {
            count: openIssues
          })}
        </Button>
      )}
    </div>
  );
}
