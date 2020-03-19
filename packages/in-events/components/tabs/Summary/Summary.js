import React, { useState } from 'react';

import EntityWithParentInformation from 'in-components/EntityInformation/EntityWithParentInformation';
import ApplicationEventContent from 'in-views/eventView/components/Event/ApplicationEventContent';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import OfflineEventDescription from 'in-events/components/legacy/OfflineEventDescription';
import WebsiteEventContent from 'in-views/eventView/components/Event/WebsiteEventContent';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import { getTimeConfigFromEventForSnapshotRetrieval } from 'in-events/timeframe';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import PopulationChart from 'in-events/components/legacy/PopulationChart';
import EventDetailsKPIs from 'in-events/components/EventDetailsKPIs';
import LoadingIndicator from 'in-components/LoadingIndicator';
import EventList from 'in-events/components/legacy/EventList';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import EventChart from 'in-events/components/EventChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import { emptyList } from 'in-services/fixedImmutables';
import getRecentEvents$ from 'in-events/recentEvents';
import { getSnapshot } from 'in-stores/snapshot';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

export default function Summary({ selectedEventId, data: event }) {
  if (!event || selectedEventId !== event.get('id')) {
    return <LoadingIndicator type="dark" />;
  }

  const eventType = getEventType(event);
  const isIncident = eventType === EVENT_TYPES.INCIDENT;

  return (
    <HeightRestrictedView
      render={() => (
        <>
          <EventDetailsKPIs event={event} isIncident={isIncident} />
          {isIncident ? <IncidentContent incident={event} /> : <EventContent event={event} />}
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
      <Row>
        <Col xs>
          <Card title="Description">
            <EntityWithParentInformation
              entityId={event.get('entityId')}
              entityType={event.get('entityType')}
              metadata={event.get('metadata')}
              timeConfig={timeConfig}
            />

            <ProblemDescription event={event} className="in-event-view-event-content" />
            <EventSpecificationLink event={event} />
          </Card>
        </Col>
      </Row>

      {isOfflineEvent(event) ? (
        <Row>
          <Col xs>
            <Card title="Last process">
              <OfflineEventDescription event={event} />
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          {hasAtLeastOneMetric(event) && (
            <Row>
              <Col xs>
                <Card title="Metrics">
                  <EventChart event={event} />
                </Card>
              </Col>
            </Row>
          )}
          {hasMetric(event, 'cpu.user') && (
            <Row>
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
    return <ProcessTopList snapshot={snapshot} timeConfig={timeConfig} considerCpuCount={true} />;
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
            {isExpanded ? 'Collapse' : `Expand (${recentEvents.length})`}
          </Button>
        )}
        {shouldRenderShowChangesButton(numChanges) && (
          <Button
            type="button"
            kind={changesAreVisible ? 'primaryv2' : 'secondary'}
            onClick={() => setChangesAreVisible(!changesAreVisible)}
          >
            {changesAreVisible ? 'Hide Changes' : 'Show Changes'}
          </Button>
        )}
      </>
    );

    return (
      <>
        <Row>
          <Col xs>
            <Card title="Population" header={header}>
              <PopulationChart
                incidentId={incident.get('id')}
                recentEvents={recentEvents}
                changesAreVisible={changesAreVisible}
                isExpanded={isExpanded}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs>
            <Card title="Events">
              <EventList incident={incident} />
            </Card>
          </Col>
        </Row>
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

function hasMetric(event, metric) {
  return event.getIn(['metadata', 'metrics'], emptyList).filter(e => e.get('metricName') === metric).size > 0;
}

function hasAtLeastOneMetric(event) {
  return event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}
