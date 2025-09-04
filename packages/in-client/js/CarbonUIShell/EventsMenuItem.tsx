/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { PERMISSION_STRATEGY } from 'in-stores/useHasPermission';
import { eventsAccessPermissions } from 'in-stores/permission';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { eventsPath } from 'in-events/navigation/paths';
import useHasAccesses from 'in-stores/useHasAccesses';
import { t } from 'in-i18n';

export default function EventsMenuItem() {
  const hasEventsAccess = useHasAccesses({
    requiredPermissions: eventsAccessPermissions,
    strategy: PERMISSION_STRATEGY.REQUIRE_ANY
  });
  const events = useObservable(openEventsAtServerTime$, [openEventsAtServerTime$]);
  const { matchLocation } = useNavigation();
  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();

  if (!hasEventsAccess) return null;

  // @ts-expect-error type not defined
  const numIncidents = events ? events.get('incidentCount') : 0;
  const menuItemHref = getEventsViewFilteredBy({ eventTypeFilter: 'incident' });
  const isActive = matchLocation(eventsPath);

  return (
    <MenuItem
      id="main-nav-events"
      label={t('in-components:mainNavigation.viewSwitcherLabelEvents')}
      icon="lib_events_inverted"
      badgeCount={numIncidents}
      href={menuItemHref}
      isActive={isActive}
    />
  );
}
