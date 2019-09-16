import React from 'react';

import EntityWithParentInformation from 'in-components/EntityInformation/EntityWithParentInformation';
import { getTimeConfigFromEventForSnapshotRetrieval } from 'in-views/eventView/services/timeframe';
import OfflineEventDescription from 'in-views/eventView/components/Event/OfflineEventDescription';
import EventSpecificationLink from 'in-views/eventView/components/Event/EventSpecificationLink';
import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import AnalyzeIssueCallsButton from 'in-views/eventView/components/AnalyzeIssueCallsButton';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import PopulationChart from 'in-views/eventView/components/Incident/PopulationChart';
import EventDependecyGraph from 'in-views/eventView/components/EventDependecyGraph';
import ProblemDescription from 'in-views/eventView/components/ProblemDescription';
import EventList from 'in-views/eventView/components/Incident/EventList';
import EventDetailsKPIs from 'in-events/components/EventDetailsKPIs';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import EventChart from 'in-events/components/EventChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import { emptyList } from 'in-services/fixedImmutables';
import getRecentEvents$ from 'in-events/recentEvents';
import Card from 'in-new-components/Card';

import locals from './Summary.mless';

export default function Summary({ selectedEventId, data: event }) {
  if (!event || selectedEventId !== event.get('id')) {
    return <LoadingIndicator type="dark" />;
  }

  const eventType = getEventType(event);
  const isIncident = eventType === EVENT_TYPES.INCIDENT;

  return (
    <HeightRestrictedView
      render={() => (
        <ContentWrapper>
          <EventDetailsKPIs event={event} isIncident={isIncident} />
          {isIncident ? <IncidentContent incident={event} /> : <EventContent event={event} />}
        </ContentWrapper>
      )}
    />
  );
}

function EventContent({ event }) {
  const timeConfigFromEvent = getTimeConfigFromEventForSnapshotRetrieval(event);

  return (
    <>
      <Row>
        <Col xs>
          <Card title="Description">
            <EntityWithParentInformation
              entityId={event.get('entityId')}
              entityType={event.get('entityType')}
              metadata={event.get('metadata')}
              timeConfig={timeConfigFromEvent}
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
          {hasEvents(event) && (
            <Row>
              <Col xs>
                <Card title="Metrics">
                  <EventChart event={event} />
                  <div className={locals.analyzeButtonWrapper}>
                    <AnalyzeIssueCallsButton event={event} />
                  </div>
                </Card>
              </Col>
            </Row>
          )}
          <Row>
            <Col xs>
              <EventDependecyGraph event={event} sectionized />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

function IncidentContent({ incident }) {
  return (
    <>
      <Row>
        <Col xs>
          <Card title="Population">
            <PopulationChart incidentId={incident.get('id')} getRecentEvents$={() => getRecentEvents$(incident)} />
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

function isOfflineEvent(event) {
  return event.hasIn(['metadata', 'entityVerificationSnapshotId']);
}

function hasEvents(event) {
  return event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}
