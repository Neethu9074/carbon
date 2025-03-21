/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { extendTimeConfigToInclude } from 'in-applications/metrics';
import { getSnapshotOrDefaultOnTimeout } from 'in-stores/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { formatDateTime } from 'in-services/formatters/date';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import PluginIcon from 'in-components/PluginIcon';
import { t } from 'in-i18n';

import locals from './InfrastructureEntityLink.mless';

export default function InfrastructureEntityLink({ entity, plugin, physicalContext, timeConfig }) {
  const snapshot = useObservable(
    () =>
      entity?.id && entity?.time
        ? getSnapshotOrDefaultOnTimeout(entity.id, null, 5000, getTimeConfigAtMoment(entity.time)).startWith(
            pendingResult
          )
        : just(null),
    [entity]
  );
  const currentTimeConfig = useTimeConfig();
  const resolvedTimeConfig = timeConfig || extendTimeConfigToInclude(currentTimeConfig, entity?.time, false);
  const isLoading = get(snapshot, ['progress', 'loading']);
  const getDashboardLink = useGetDashboardLink();

  if (isLoading || physicalContext === null) {
    return (
      <div className={locals.skeleton}>
        <LoadingSkeleton className={locals.skeleton} />
      </div>
    );
  }

  if (!entity || !snapshot) {
    return (
      <div className={locals.noLink}>
        <PluginIcon className={locals.simplePluginIcon} />{' '}
        {t('in-analyze:traceDetail.components.callDetails.correlationMissing')}
      </div>
    );
  }

  return (
    <EntityLink
      plugin={plugin}
      snapshot={snapshot}
      label={entity.label || `Unknown at ${formatDateTime(entity.time)}`}
      href={getDashboardLink(entity.id, {
        pathname: '/physical/dashboard',
        to: resolvedTimeConfig.to,
        focusedMoment: resolvedTimeConfig.focusedMoment,
        autoRefresh: resolvedTimeConfig.autoRefresh
      })}
    />
  );
}
