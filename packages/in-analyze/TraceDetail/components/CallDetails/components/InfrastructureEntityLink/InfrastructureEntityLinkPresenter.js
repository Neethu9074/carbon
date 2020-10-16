import { get } from 'lodash';
import React from 'react';

import { shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { formatDateTime } from 'in-services/formatters/date';
import Skeleton from 'in-new-components/Loading/Skeleton';
import PluginIcon from 'in-components/PluginIcon';

import locals from './InfrastructureEntityLink.mless';

export default function InfrastructureEntityLink({ entity, snapshot, plugin, physicalContext }) {
  const isLoading = get(snapshot, ['progress', 'loading']);

  if (isLoading || physicalContext === null) {
    return (
      <div className={locals.skeleton}>
        <Skeleton className={locals.skeleton} />
      </div>
    );
  }

  if (!entity || !snapshot) {
    return (
      <div className={locals.noLink}>
        <PluginIcon className={locals.simplePluginIcon} /> Correlation missing
      </div>
    );
  }

  return (
    <EntityLink
      plugin={plugin}
      snapshot={snapshot}
      label={entity.label || `Unknown at ${formatDateTime(entity.time)}`}
      href$={shouldStayInCurrentTimeModeForNavigationToSnapshot(entity.id).flatMap(stay =>
        stay
          ? getDashboardLink(entity.id, { pathname: '/physical/dashboard' })
          : getDashboardLink(entity.id, {
              pathname: '/physical/dashboard',
              to: entity.time,
              focusedMoment: entity.time,
              autoRefresh: false
            })
      )}
    />
  );
}
