import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  SourceLocation,
  DestinationLocation
} from 'in-analyze/TraceDetail/components/CallDetails/components/LocationComponents';
import StackTraceBehavior from 'in-analyze/TraceDetail/components/CallDetails/components/StackTrace/StackTraceBehavior';
import InfrastructureHierarchy from 'in-analyze/TraceDetail/components/CallDetails/components/InfrastructureHierarchy';
import CallErrorSummaries from 'in-analyze/TraceDetail/components/CallDetails/components/CallErrorSummaries';
import { getSnapshot, shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import SpanDetails from 'in-analyze/TraceDetail/components/CallDetails/components/SpanDetails';
import CallLogs from 'in-analyze/TraceDetail/components/CallDetails/components/CallLogs';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import ExpandableGroup from 'in-new-components/ExpandableGroup';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { pendingResult } from 'in-services/fixedObjects';
import PluginIcon from 'in-components/PluginIcon';
import { find } from 'in-services/arrayUtils';
import connectTo from 'in-hoc/connectTo';

import locals from './ServiceComponent.mless';

export default function ServiceComponent({ call }) {
  const sourceService = get(call, ['source', 'service']);
  const service = get(call, ['destination', 'service']);
  const endpoint = get(call, ['destination', 'endpoint']);

  const entrySpan = getSpan(call, 'ENTRY');
  const exitSpan = getSpan(call, 'EXIT');

  const sourcePhysicalContext = get(call, ['source', 'physicalContext']);
  const destinationPhysicalContext = get(call, ['destination', 'physicalContext']);

  const sourceEntity = get(call, ['source', 'physicalContext', 'process']);
  const destinationEntity = get(call, ['destination', 'physicalContext', 'process']);

  const sourceSnapshotId = getSnapshotId(call, 'source');
  const destinationSnapshotId = getSnapshotId(call, 'destination');

  const logs = call.logs;
  const errorLogs = logs.filter(log => log.errorCount === 1);
  const warnLogs = logs.filter(log => log.errorCount === 0);

  if (sourcePhysicalContext === null && destinationPhysicalContext === null) {
    return (
      <div className={locals.serviceLine}>
        <div className={locals.skeleton}>
          <Skeleton className={locals.skeleton} />
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {service &&
        endpoint && (
          <Fragment>
            <div className={locals.arrowWrapper}>
              <div className={locals.verticalLineTop} />
              <div className={locals.verticalLine} />
              <div className={locals.verticalLineBottom}>
                <svg viewBox="0 0 13.25 15.95" className={locals.lineArrow}>
                  <path fill="#808285" d="M0 0v15.95l13.25-7.98L0 0z" />
                </svg>
              </div>
              <SourceLocation
                location={'source'}
                sourceService={sourceService}
                snapshotId={sourceSnapshotId}
                entity={sourceEntity}
                span={exitSpan}
                physicalContext={sourcePhysicalContext}
              />
              <div className={locals.sourceChildren}>
                {exitSpan && (
                  <ExpandableGroup
                    title={exitSpan.stackTrace.length > 0 ? 'Details & Stack Trace' : 'Details'}
                    defaultExpanded
                  >
                    <SpanDetails call={call} span={exitSpan} />
                    {exitSpan.stackTrace.length > 0 && (
                      <StackTraceBehavior stackTrace={exitSpan.stackTrace} relation={call.destination} noPadding />
                    )}
                  </ExpandableGroup>
                )}
                {(exitSpan || sourceSnapshotId) && (
                  <ExpandableGroup
                    title={
                      <div className={locals.infraTitle}>
                        <span>Infrastructure</span>
                        {sourceEntity && (
                          <InfrastructureEntityLink
                            entity={sourceEntity}
                            plugin={get(call, ['source', 'physicalContext', 'process', 'plugin'])}
                            snapshotId={sourceSnapshotId}
                            physicalContext={sourcePhysicalContext}
                          />
                        )}
                      </div>
                    }
                  >
                    <InfrastructureHierarchy
                      snapshotId={sourceSnapshotId}
                      calculateHierarchy
                      pathname={physicalDashboardPath}
                    />
                  </ExpandableGroup>
                )}

                <CallErrorSummaries call={call} kind="EXIT" />
              </div>

              <DestinationLocation
                location={'destination'}
                endpoint={endpoint}
                service={service}
                snapshotId={destinationSnapshotId}
                entity={destinationEntity}
                span={entrySpan}
              />
            </div>
            <div className={locals.destinationChildren}>
              {entrySpan && (
                <ExpandableGroup
                  title={entrySpan.stackTrace.length > 0 ? 'Details & Stack Trace' : 'Details'}
                  defaultExpanded
                >
                  <SpanDetails call={call} span={entrySpan} />
                  {entrySpan.stackTrace.length > 0 && (
                    <StackTraceBehavior stackTrace={entrySpan.stackTrace} relation={call.destination} noPadding />
                  )}
                </ExpandableGroup>
              )}
              <ExpandableGroup
                title={
                  <div className={locals.infraTitle}>
                    <span>Infrastructure</span>
                    <InfrastructureEntityLink
                      entity={destinationEntity}
                      plugin={get(call, ['destination', 'physicalContext', 'process', 'plugin'])}
                      snapshotId={destinationSnapshotId}
                      physicalContext={destinationPhysicalContext}
                    />
                  </div>
                }
              >
                {destinationEntity && (
                  <InfrastructureHierarchy
                    snapshotId={destinationSnapshotId}
                    calculateHierarchy
                    pathname={physicalDashboardPath}
                  />
                )}
              </ExpandableGroup>
              {logs.length > 0 && (
                <ExpandableGroup
                  title={`Logs ( ${errorLogs.length > 0 ? `${errorLogs.length} Error` : null} ${
                    warnLogs.length > 0 ? `${warnLogs.length} Warning` : ''
                  } )`}
                >
                  <CallLogs call={call} />
                </ExpandableGroup>
              )}
              <CallErrorSummaries call={call} kind="ENTRY" />
            </div>
          </Fragment>
        )}
    </Fragment>
  );
}

const InfrastructureEntityLink = connectTo(({ entity }) => ({
  // load a snapshot to possibly get a more specific entity (process vs. Spring Boot app)
  snapshot:
    entity &&
    entity.id &&
    entity.time &&
    getSnapshot(entity.id, getTimeConfigAtMoment(entity.time)).startWith(pendingResult)
}))(function InfrastructureEntityLink({ entity, snapshot, plugin, snapshotId, physicalContext }) {
  const isLoading = get(snapshot, ['progress', 'loading']);

  if (isLoading || physicalContext === null) {
    return (
      <div className={locals.skeleton}>
        <Skeleton className={locals.skeleton} />
      </div>
    );
  }

  if (!entity && !snapshotId) {
    return (
      <div className={locals.noLink}>
        <PluginIcon className={locals.simplePluginIcon} size="xs" /> Unmonitored
      </div>
    );
  } else if (!entity && snapshotId && !snapshot) {
    return (
      <div className={locals.noLink}>
        <PluginIcon className={locals.simplePluginIcon} size="xs" /> Correlation missing
      </div>
    );
  } else {
    return (
      <EntityLink
        plugin={plugin}
        snapshot={snapshot}
        label={entity.label || `Unknown at ${formatDateTime(entity.time)}`}
        href$={shouldStayInCurrentTimeModeForNavigationToSnapshot(entity.id).flatMap(
          stay =>
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
});

function getSnapshotId(call, location) {
  const snapshotId =
    get(call, [location, 'physicalContext', 'process', 'id']) ||
    get(call, [location, 'physicalContext', 'cluster', 'id']) ||
    get(call, [location, 'physicalContext', 'container', 'id']) ||
    get(call, [location, 'physicalContext', 'host', 'id']);

  return snapshotId;
}

function getSpan(call, kind) {
  let span = find(call.spans, _span => _span.kind === kind);
  return span && span.data && Object.keys(span.data).length > 0 ? span : null;
}
