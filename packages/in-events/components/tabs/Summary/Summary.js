/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import AgentMonitoringIssueDescription from 'in-events/components/legacy/AgentMonitoringIssueDescription';
import { getTimeConfigFromEventForSnapshotRetrieval, getTimeConfigFromEvent } from 'in-events/timeframe';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import ApplicationEventContent from 'in-events/components/EventContent/ApplicationEventContent';
import OfflineEventDescription from 'in-events/components/legacy/OfflineEventDescription';
import AnalyzeIssueCallsButton from 'in-events/components/legacy/AnalyzeIssueCallsButton';
import WebsiteEventContent from 'in-events/components/EventContent/WebsiteEventContent';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import SubEntityInformation from 'in-events/components/legacy/SubEntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import PopulationChart from 'in-events/components/legacy/PopulationChart';
import IncidentEventListRows from 'in-events/components/legacy/EventList';
import EventDetailsKPIs from 'in-events/components/EventDetailsKPIs';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import EventChart from 'in-events/components/EventChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import { emptyList } from 'in-services/fixedImmutables';
import getRecentEvents$ from 'in-events/recentEvents';
import { getSnapshot } from 'in-stores/snapshot';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary({ selectedEventId, data: event }) {
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
            <EventDetailsKPIs event={event} isIncident={isIncident} />
            {isIncident ? <IncidentContent incident={event} /> : <EventContent event={event} />}
          </div>
        </>
      )}
    />
  );
}

function EventContent({ event }) {
  if (isWebsiteSmartAlertEvent(event)) {
    return <WebsiteEventContent event={event} />;
  }

  if (isApplicationSmartAlertEvent(event)) {
    return <ApplicationEventContent event={event} />;
  }

  const timeConfig = getTimeConfigFromEventForSnapshotRetrieval(event);

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
              <ProblemDescription event={event} className="in-event-view-event-content" />
            )}
            <DescriptionButtons>
              <EventSpecificationLink event={event} />
              <AnalyzeIssueCallsButton event={event} />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>

      {isOfflineEvent(event) ? (
        <Row withoutSideMargin>
          <Col xs>
            <Card title={t('in-events:titleLastProcess')}>
              <OfflineEventDescription event={event} />
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
                <ProcessContent snapshotId={event.get('entityId')} timeConfig={timeConfig} />
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
}

const ProcessContent = connectTo(
  ({ snapshotId, timeConfig }) => ({
    snapshot: getSnapshot(snapshotId, timeConfig).startWith(null)
  }),
  function ProcessContent({ snapshot, timeConfig }) {
    if (!snapshot || (snapshot.progress && snapshot.progress.loading)) {
      return <LoadingIndicator inline type="dark" style={{ height: '16px' }} />;
    }
    return <ProcessTopList snapshot={snapshot} timeConfig={timeConfig} />;
  }
);

const IncidentContent = connectTo(
  ({ incident }) => ({
    recentEvents: getRecentEvents$(incident)
  }),
  function IncidentContent({ incident, recentEvents }) {
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
        <IncidentEventListRows incident={incident} />
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

function isOfflineEvent(event) {
  return event.hasIn(['metadata', 'entityVerificationSnapshotId']);
}

function isWebsiteSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'websiteId']);
}

function isApplicationSmartAlertEvent(event) {
  return event.hasIn(['metadata', 'applicationId']);
}

function isAgentMonitoringIssueEvent(event) {
  return event.hasIn(['metadata', 'agent_monitoring_issue']);
}

function hasMetric(event, metric) {
  return event.getIn(['metadata', 'metrics'], emptyList).filter(e => e.get('metricName') === metric).size > 0;
}

function hasAtLeastOneMetric(event) {
  return event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}
