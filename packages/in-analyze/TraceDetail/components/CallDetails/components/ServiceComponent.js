/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { get } from 'lodash';
import { t } from 'in-i18n';

import {
  SourceLocation,
  DestinationLocation,
  WebsiteSourceLocation,
  MobileAppSourceLocation
} from 'in-analyze/TraceDetail/components/CallDetails/components/LocationComponents';
import InfrastructureEntityLink from 'in-analyze/TraceDetail/components/CallDetails/components/InfrastructureEntityLink';
import StackTraceBehavior from 'in-analyze/TraceDetail/components/CallDetails/components/StackTrace/StackTraceBehavior';
import InfrastructureHierarchy from 'in-analyze/TraceDetail/components/CallDetails/components/InfrastructureHierarchy';
import MobileAppBeaconDetails from 'in-analyze/TraceDetail/components/CallDetails/components/MobileAppBeaconDetails';
import WebsiteBeaconDetails from 'in-analyze/TraceDetail/components/CallDetails/components/WebsiteBeaconDetails';
import ProfileInformation from 'in-analyze/TraceDetail/components/CallDetails/components/ProfileInformation';
import SpanDetails from 'in-analyze/TraceDetail/components/CallDetails/components/SpanDetails';
import CallLogs from 'in-analyze/TraceDetail/components/CallDetails/components/CallLogs';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getResolvedTimeConfig } from 'in-applications/metrics';
import ExpandableGroup from 'in-new-components/ExpandableGroup';
import Skeleton from 'in-new-components/Loading/Skeleton';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { isBlank } from 'in-services/util/string';
import { find } from 'in-services/arrayUtils';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';

import locals from './ServiceComponent.mless';

export default function ServiceComponent({ call, websiteBeacon, mobileAppBeacon }) {
  const timeConfig = useTimeConfig();
  const sourceService = get(call, ['source', 'service']);
  const service = get(call, ['destination', 'service']);
  const endpoint = get(call, ['destination', 'endpoint']);

  const entrySpan = getSpan(call, 'ENTRY');
  const exitSpan = getSpan(call, 'EXIT');
  const intermediateSpan = getSpan(call, 'INTERMEDIATE');

  const sourcePhysicalContext = get(call, ['source', 'physicalContext']);
  const destinationPhysicalContext = get(call, ['destination', 'physicalContext']);

  const sourceEntity = getEntity(call, 'source');
  const destinationEntity = getEntity(call, 'destination');

  const sourceSnapshotId = getSnapshotId(call, 'source');
  const destinationSnapshotId = getSnapshotId(call, 'destination');

  // Special case for batch calls without source. Instead of showing a misleading message "Not monitored
  // by Instana", show the destination span only in a similar way as we do for intermediate spans.
  const batchCallWithoutSource = sourceService?.id === 'ROOT' && sourceSnapshotId == null && endpoint?.type === 'BATCH';

  const isSyntheticBatchSpan = entrySpan && entrySpan.name === 'batch-synthetic';
  const foreignParentId = entrySpan?.foreignParentId;

  const logs = call.logs;
  const errorLogs = logs.filter(log => log.errorCount === 1);
  const warnLogs = logs.filter(log => log.errorCount === 0);

  const canSeeCallDetails = role.canViewTraceDetails;
  const canViewLogs = role.canViewLogs;

  const sourceProcessSnapshotId = sourcePhysicalContext?.process?.id;
  const destinationProcessSnapshotId = destinationPhysicalContext?.process?.id;

  if (sourcePhysicalContext === null && destinationPhysicalContext === null) {
    return (
      <div className={locals.serviceLine}>
        <div className={locals.skeleton}>
          <Skeleton className={locals.skeleton} />
        </div>
      </div>
    );
  }

  if (intermediateSpan) {
    return (
      service &&
      endpoint && (
        <Fragment>
          <DestinationLocation
            location={'destination'}
            endpoint={endpoint}
            service={service}
            snapshotId={destinationSnapshotId}
            entity={destinationEntity}
            span={intermediateSpan}
            inProcessCall
          />
          {canSeeCallDetails && hasNonEmptyData(intermediateSpan) && (
            <ExpandableGroup
              title={
                intermediateSpan.stackTrace.length > 0
                  ? t('in-analyze:traceDetail.callDetails.serviceComponent.detailsAndStackTrace')
                  : t('in-analyze:traceDetail.callDetails.serviceComponent.details')
              }
              defaultExpanded
            >
              <SpanDetails call={call} span={intermediateSpan} />
              {intermediateSpan.stackTrace.length > 0 && (
                <StackTraceBehavior stackTrace={intermediateSpan.stackTrace} relation={call.source} noPadding />
              )}
            </ExpandableGroup>
          )}
          <ExpandableGroup
            title={
              <div className={locals.infraTitle}>
                <span>Infrastructure</span>
                <InfrastructureEntityLink
                  entity={destinationEntity}
                  plugin={destinationEntity && destinationEntity.plugin}
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
                timeConfig={getResolvedTimeConfig(timeConfig, call.start)}
              />
            )}
          </ExpandableGroup>
          <Logs />
        </Fragment>
      )
    );
  }

  if (!service || !endpoint) {
    return null;
  }

  return (
    <>
      <div className={batchCallWithoutSource ? undefined : locals.arrowWrapper}>
        {batchCallWithoutSource || (
          <>
            <div className={locals.verticalLineTop} />
            <div className={locals.verticalLine} />
            <div className={locals.verticalLineBottom}>
              <svg viewBox="0 0 13.25 15.95" className={locals.lineArrow}>
                <path fill="#808285" d="M0 0v15.95l13.25-7.98L0 0z" />
              </svg>
            </div>
            {websiteBeacon && sourceService.id === 'ROOT' && (
              <WebsiteSourceLocation location={'source'} beacon={websiteBeacon} />
            )}
            {mobileAppBeacon && sourceService.id === 'ROOT' && (
              <MobileAppSourceLocation location={'source'} beacon={mobileAppBeacon} />
            )}
            {((!websiteBeacon && !mobileAppBeacon) || sourceService.id !== 'ROOT') && (
              <SourceLocation
                location={'source'}
                service={sourceService}
                snapshotId={sourceSnapshotId}
                entity={sourceEntity}
                span={exitSpan}
                physicalContext={sourcePhysicalContext}
              />
            )}
            <div className={locals.sourceChildren}>
              {websiteBeacon && sourceService.id === 'ROOT' && (
                <ExpandableGroup
                  title={t('in-analyze:traceDetail.callDetails.serviceComponent.details')}
                  defaultExpanded
                >
                  <WebsiteBeaconDetails beacon={websiteBeacon} />
                </ExpandableGroup>
              )}
              {mobileAppBeacon && sourceService.id === 'ROOT' && (
                <ExpandableGroup
                  title={t('in-analyze:traceDetail.callDetails.serviceComponent.details')}
                  defaultExpanded
                >
                  <MobileAppBeaconDetails beacon={mobileAppBeacon} />
                </ExpandableGroup>
              )}
              {canSeeCallDetails && hasNonEmptyData(exitSpan) && (
                <ExpandableGroup
                  title={
                    exitSpan.stackTrace.length > 0
                      ? t('in-analyze:traceDetail.callDetails.serviceComponent.detailsAndStackTrace')
                      : t('in-analyze:traceDetail.callDetails.serviceComponent.details')
                  }
                  defaultExpanded
                >
                  <SpanDetails call={call} span={exitSpan} />
                  {exitSpan.stackTrace.length > 0 && (
                    <StackTraceBehavior stackTrace={exitSpan.stackTrace} relation={call.source} noPadding />
                  )}
                </ExpandableGroup>
              )}
              {sourceService.id === 'ROOT' && !websiteBeacon && !mobileAppBeacon && (
                <ExpandableGroup
                  title={t('in-analyze:traceDetail.callDetails.serviceComponent.details')}
                  defaultExpanded
                >
                  <p>
                    {isBlank(foreignParentId)
                      ? t('in-analyze:traceDetail.callDetails.serviceComponent.sourceUnmonitored')
                      : t('in-analyze:traceDetail.callDetails.serviceComponent.sourceMonitoredByAnotherProvider', {
                          foreignParentId
                        })}
                  </p>
                </ExpandableGroup>
              )}

              {sourceEntity && sourceProcessSnapshotId && (
                <ProfileInformation
                  processSnapshotId={sourceProcessSnapshotId}
                  start={call.start}
                  end={call.start + call.duration}
                  time={sourceEntity.time}
                />
              )}

              {sourceSnapshotId && (
                <ExpandableGroup
                  expandedTitle="Infrastructure"
                  title={
                    <div className={locals.infraTitle}>
                      <span>Infrastructure</span>
                      {sourceEntity && (
                        <InfrastructureEntityLink
                          entity={sourceEntity}
                          plugin={sourceEntity && sourceEntity.plugin}
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
                    entity={sourceEntity}
                    plugin={sourceEntity && sourceEntity.plugin}
                    physicalContext={sourcePhysicalContext}
                    timeConfig={getResolvedTimeConfig(timeConfig, call.start)}
                  />
                </ExpandableGroup>
              )}
            </div>
          </>
        )}
        <DestinationLocation
          location={'destination'}
          endpoint={endpoint}
          service={service}
          snapshotId={destinationSnapshotId}
          entity={destinationEntity}
          span={entrySpan}
          inProcessCall={batchCallWithoutSource}
        />
      </div>
      <div className={locals.destinationChildren}>
        {canSeeCallDetails && (hasNonEmptyData(entrySpan) || isSyntheticBatchSpan) && (
          <ExpandableGroup
            title={
              entrySpan.stackTrace.length > 0
                ? t('in-analyze:traceDetail.callDetails.serviceComponent.detailsAndStackTrace')
                : t('in-analyze:traceDetail.callDetails.serviceComponent.details')
            }
            defaultExpanded
          >
            <SpanDetails call={call} span={entrySpan} />
            {entrySpan.stackTrace.length > 0 && (
              <StackTraceBehavior stackTrace={entrySpan.stackTrace} relation={call.destination} noPadding />
            )}
          </ExpandableGroup>
        )}

        {(entrySpan || (destinationSnapshotId && !destinationPhysicalContext.cluster)) && (
          <ExpandableGroup
            expandedTitle={t('in-analyze:traceDetail.callDetails.serviceComponent.infrastructure')}
            title={
              <div className={locals.infraTitle}>
                <span>{t('in-analyze:traceDetail.callDetails.serviceComponent.infrastructure')}</span>
                <InfrastructureEntityLink
                  entity={destinationEntity}
                  plugin={destinationEntity && destinationEntity.plugin}
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
                entity={destinationEntity}
                plugin={destinationEntity && destinationEntity.plugin}
                physicalContext={destinationPhysicalContext}
                timeConfig={getResolvedTimeConfig(timeConfig, call.start)}
              />
            )}
          </ExpandableGroup>
        )}

        {destinationEntity && destinationProcessSnapshotId && (
          <ProfileInformation
            processSnapshotId={destinationProcessSnapshotId}
            start={call.start}
            end={call.start + call.duration}
            time={destinationEntity.time}
          />
        )}

        {destinationPhysicalContext && destinationPhysicalContext.cluster && (
          <ExpandableGroup
            expandedTitle={t('in-analyze:traceDetail.callDetails.serviceComponent.infrastructure')}
            title={
              <Tooltip
                content={t('in-analyze:traceDetail.callDetails.serviceComponent.desClusterNotCorrelateNode')}
                align="bottomLeft"
              >
                <div className={locals.infraTitle}>
                  <span>{t('in-analyze:traceDetail.callDetails.serviceComponent.infrastructure')}</span>
                  <InfrastructureEntityLink
                    entity={destinationEntity}
                    plugin={destinationEntity && destinationEntity.plugin}
                    snapshotId={destinationSnapshotId}
                    physicalContext={destinationPhysicalContext}
                  />
                </div>
              </Tooltip>
            }
          />
        )}
        <Logs />
      </div>
    </>
  );

  function Logs() {
    if (!canViewLogs || !logs || logs.length === 0) {
      return null;
    }

    return (
      <ExpandableGroup
        title={`Logs ( ${errorLogs.length > 0 ? `${errorLogs.length} ${errorLogs.length > 1 ? 'Errors' : 'Error'}` : ''}
        ${warnLogs.length > 0 ? `${warnLogs.length} ${warnLogs.length > 1 ? 'Warnings' : 'Warning'}` : ''} )`}
      >
        <CallLogs call={call} />
      </ExpandableGroup>
    );
  }
}

function getSnapshotId(call, location) {
  const snapshotId =
    get(call, [location, 'physicalContext', 'process', 'id']) ||
    get(call, [location, 'physicalContext', 'cluster', 'id']) ||
    get(call, [location, 'physicalContext', 'container', 'id']) ||
    get(call, [location, 'physicalContext', 'host', 'id']);

  return snapshotId;
}

function getEntity(call, location) {
  const entity =
    get(call, [location, 'physicalContext', 'process']) ||
    get(call, [location, 'physicalContext', 'cluster']) ||
    get(call, [location, 'physicalContext', 'container']) ||
    get(call, [location, 'physicalContext', 'host']);

  return entity;
}

function getSpan(call, kind) {
  return find(call.spans, _span => _span.kind === kind);
}

function hasNonEmptyData(span) {
  return span && span.data && Object.keys(span.data).length > 0;
}
