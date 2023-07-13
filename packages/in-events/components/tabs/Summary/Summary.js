/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { Card } from '@instana/components';

import {
  getSnapshotId,
  isEntityVerificationEvent,
  isHostAvailabilityEvent,
  isAgentMonitoringIssueEvent,
  isApplicationSmartAlertEvent,
  isWebsiteSmartAlertEvent,
  isInfraSmartAlertEvent,
  isSyntheticSmartAlertEvent,
  getTimeConfigForSnapshotRetrieval,
  isIbmMqFileTransferIssueEvent,
  isMobileSmartAlertEvent,
  isEntityCountVerificationEvent
} from 'in-events/components/eventUtil';
import EntityCountVerificationEventContent from 'in-events/components/EventContent/EntityCountVerificationEventContent';
import { KubernetesEventContent, isKubernetesEvent } from 'in-events/components/EventContent/KubernetesEventContent';
import IbmMqFileTransferMetadataTable from 'in-events/components/tabs/Summary/IbmMqFileTransferMetadataTable';
import { DeprecatedCustomEventWarning } from 'in-events/components/tabs/Summary/DeprecatedCustomEventWarning';
import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import AgentMonitoringIssueDescription from 'in-events/components/legacy/AgentMonitoringIssueDescription';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import ApplicationEventContent from 'in-events/components/EventContent/ApplicationEventContent';
import SyntheticEventContent from 'in-events/components/EventContent/SyntheticEventContent';
import AnalyzeIssueCallsButton from 'in-events/components/legacy/AnalyzeIssueCallsButton';
import OfflineEventDescription from 'in-events/components/legacy/OfflineEventDescription';
import AssociatedActions from 'in-automation/AssociatedActionsCard/AssociatedActionsCard';
import WebsiteEventContent from 'in-events/components/EventContent/WebsiteEventContent';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import MobileEventContent from 'in-events/components/EventContent/MobileEventContent';
import InfraEventContent from 'in-events/components/EventContent/InfraEventContent';
import SubEntityInformation from 'in-events/components/legacy/SubEntityInformation';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import PopulationChart from 'in-events/components/legacy/PopulationChart';
import IncidentEventListRows from 'in-events/components/legacy/EventList';
import { getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import EventDetailsKPIs from 'in-events/components/EventDetailsKPIs';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import EventChart from 'in-events/components/EventChart';
import { emptyList } from 'in-services/fixedImmutables';
import getRecentEvents$ from 'in-events/recentEvents';
import { Row, Col } from 'in-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary({ selectedEventId, data: event }) {
  const expiredSnapshotId = getSnapshotId(event, isEntityVerificationEvent(event));
  const expiredSnapshotVersions = useObservable(getSnapshotVersionsObservable, [expiredSnapshotId]);
  const latestSnapshot = expiredSnapshotVersions && getLatestSnapshot(expiredSnapshotVersions.toArray());

  if (!event || selectedEventId !== event.get('id')) {
    return <LoadingIndicator size="xxxl" style={{ height: '200px' }} />;
  }

  const eventType = getEventType(event);
  const isIncident = eventType === EVENT_TYPES.INCIDENT;

  return (
    <HeightRestrictedView
      render={() => (
        <>
          <div className={locals.content}>
            <DeprecatedCustomEventWarning event={event.toJS()} isIncident={isIncident} />
            <EventDetailsKPIs event={event} isIncident={isIncident} />
            {isIncident ? (
              <IncidentContent incident={event} latestSnapshot={latestSnapshot} />
            ) : (
              <EventContent event={event} latestSnapshot={latestSnapshot} />
            )}
          </div>
        </>
      )}
    />
  );
}

const EventContent = connectTo(
  ({ event, latestSnapshot }) => ({
    snapshot: getSnapshot(event.get('entityId'), getTimeConfigForSnapshotRetrieval(event, latestSnapshot)).startWith(
      null
    )
  }),
  function EventContent({ event, latestSnapshot, snapshot }) {
    const timeConfig = getTimeConfigForSnapshotRetrieval(event, latestSnapshot);

    if (isWebsiteSmartAlertEvent(event)) {
      return <WebsiteEventContent event={event} />;
    }

    if (isApplicationSmartAlertEvent(event)) {
      return <ApplicationEventContent event={event} snapshot={snapshot} />;
    }

    if (isKubernetesEvent(event)) {
      return <KubernetesEventContent event={event} timeConfig={timeConfig} />;
    }

    if (isInfraSmartAlertEvent(event)) {
      return <InfraEventContent event={event} />;
    }

    if (isSyntheticSmartAlertEvent(event)) {
      return <SyntheticEventContent event={event} />;
    }

    if (isMobileSmartAlertEvent(event)) {
      return <MobileEventContent event={event} />;
    }

    if (isEntityCountVerificationEvent(event)) {
      return <EntityCountVerificationEventContent event={event} snapshot={snapshot} />;
    }

    const eventType = getEventType(event);
    const isIssue = eventType === EVENT_TYPES.ISSUE_WARNING || eventType === EVENT_TYPES.ISSUE_CRITICAL;
    const hasEventSpec = event.getIn(['metadata', 'eventSpecificationId'], '') !== '';
    const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');

    return (
      <>
        <ViewTrackingMeta
          data={{
            productArea: 'Events',
            pageRootName: 'Event'
          }}
        />

        <Row withoutSideMargin>
          <Col xs>
            <Card title={t('in-events:titleDescription')}>
              <EntityWithParentInformation
                entityId={event.get('entityId')}
                entityType={event.get('entityType')}
                metadata={event.get('metadata')}
                timeConfig={timeConfig}
                linkTimeConfig={getTimeConfigFromEvent(event)}
              />
              <SubEntityInformation event={event} />
              {isAgentMonitoringIssueEvent(event) ? (
                <AgentMonitoringIssueDescription
                  event={event}
                  timeConfig={timeConfig}
                  className="in-event-view-event-content"
                />
              ) : (
                <ProblemDescription fixSuggestion={fixSuggestion} className="in-event-view-event-content" />
              )}
              <DescriptionButtons>
                <EventSpecificationLink event={event.toJS()} />
                <AnalyzeIssueCallsButton event={event} />
              </DescriptionButtons>
            </Card>
          </Col>
        </Row>
        {isEntityVerificationEvent(event) || isHostAvailabilityEvent(event) ? (
          <Row withoutSideMargin>
            <Col xs>
              <Card
                title={
                  isEntityVerificationEvent(event) ? t('in-events:titleLastProcess') : t('in-events:titleLastHost')
                }
              >
                <OfflineEventDescription event={event} latestSnapshot={latestSnapshot} />
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            {hasAtLeastOneMetric(event) && (
              <Row withoutSideMargin>
                <Col xs>
                  <Card title={t('in-events:titleMetrics')}>
                    <EventChart event={event} />
                  </Card>
                </Col>
              </Row>
            )}
            {hasMetric(event, 'cpu.user') && (
              <Row withoutSideMargin>
                <Col xs>
                  <ProcessContent snapshot={snapshot} timeConfig={timeConfig} />
                </Col>
              </Row>
            )}
          </>
        )}
        {isIssue && isIbmMqFileTransferIssueEvent(event) && (
          <Row withoutSideMargin>
            <Col xs>
              <IbmMqFileTransferMetadataTable
                ibmMqFileTransferMetadata={event?.getIn(['metadata', 'ibmMqFileTransfer'], emptyList)?.toJS() ?? []}
              />
            </Col>
          </Row>
        )}
        {actionAutomationEnabled &&
          role.canConfigureAutomationActions &&
          role.canConfigureCustomAlerts &&
          isIssue &&
          hasEventSpec && (
            <Row withoutSideMargin>
              <Col xs>
                <Card>
                  <AssociatedActions volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={event?.toJS()} />
                </Card>
              </Col>
            </Row>
          )}
      </>
    );
  }
);

function ProcessContent({ snapshot, timeConfig }) {
  if (!snapshot || (snapshot.progress && snapshot.progress.loading)) {
    return <LoadingIndicator inline type="dark" style={{ height: '16px' }} />;
  }
  return <ProcessTopList snapshot={snapshot} timeConfig={timeConfig} />;
}

const IncidentContent = connectTo(
  ({ incident, latestSnapshot }) => ({
    recentEvents: getRecentEvents$(incident),
    snapshot: getSnapshot(
      incident.get('entityId'),
      getTimeConfigForSnapshotRetrieval(incident, latestSnapshot)
    ).startWith(null)
  }),
  function IncidentContent({ incident, recentEvents, latestSnapshot, snapshot }) {
    const [changesAreVisible, setChangesAreVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const numChanges = getNumberOfChanges(recentEvents);

    const header = (
      <>
        {shouldRenderExpandButton(recentEvents, changesAreVisible, numChanges) && (
          <Button
            type="button"
            kind={isExpanded ? 'primaryv2' : 'secondary'}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded
              ? t('in-events:buttonCollapse')
              : t('in-events:buttonExpandEvents', { eventsLength: recentEvents.length })}
          </Button>
        )}
        {shouldRenderShowChangesButton(numChanges) && (
          <Button
            type="button"
            kind={changesAreVisible ? 'primaryv2' : 'secondary'}
            onClick={() => setChangesAreVisible(!changesAreVisible)}
          >
            {changesAreVisible ? t('in-events:buttonHideChanges') : t('in-events:buttonShowChanges')}
          </Button>
        )}
      </>
    );

    return (
      <>
        <Row withoutSideMargin>
          <Col xs>
            <Card title={t('in-events:titleIncidentTimeline')} header={header}>
              <PopulationChart
                incidentId={incident.get('id')}
                recentEvents={recentEvents}
                changesAreVisible={changesAreVisible}
                isExpanded={isExpanded}
              />
            </Card>
          </Col>
        </Row>
        <IncidentEventListRows incident={incident} snapshot={snapshot} latestSnapshot={latestSnapshot} />
      </>
    );
  }
);

function getNumberOfChanges(recentEvents) {
  if (!recentEvents) {
    return 0;
  }

  let counter = 0;
  for (let i = 0, length = recentEvents.length; i < length; i++) {
    const event = recentEvents[i];
    if (getEventType(event) === EVENT_TYPES.CHANGE) {
      counter++;
    }
  }
  return counter;
}

function shouldRenderShowChangesButton(numChanges) {
  return numChanges > 0;
}

function shouldRenderExpandButton(recentEvents, changesAreVisible, numChanges) {
  return recentEvents && recentEvents.length - (!changesAreVisible ? numChanges : 0) > 10;
}

function hasMetric(event, metric) {
  return event.getIn(['metadata', 'metrics'], emptyList).filter(e => e.get('metricName') === metric).size > 0;
}

function hasAtLeastOneMetric(event) {
  return event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}

function getLatestSnapshot(snapshotVersions) {
  return snapshotVersions.sort((a, b) => a.get('to') - b.get('to')).pop();
}

function getSnapshotVersionsObservable([expiredSnapshotId]) {
  return expiredSnapshotId && getSnapshotVersions(expiredSnapshotId);
}
