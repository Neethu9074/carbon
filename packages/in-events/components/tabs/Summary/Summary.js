import React from 'react';

import OfflineEventDescription from 'in-views/eventView/components/Event/OfflineEventDescription';
import EventSpecificationLink from 'in-views/eventView/components/Event/EventSpecificationLink';
import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import AnalyzeIssueCallsButton from 'in-views/eventView/components/AnalyzeIssueCallsButton';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import PopulationChart from 'in-views/eventView/components/Incident/PopulationChart';
import EventDependecyGraph from 'in-views/eventView/components/EventDependecyGraph';
import LegacyIncidentContent from 'in-views/eventView/components/Incident/Content';
import ProblemDescription from 'in-views/eventView/components/ProblemDescription';
import LegacyEventContent from 'in-views/eventView/components/Event/Content';
import EventList from 'in-views/eventView/components/Incident/EventList';
import EventDetailsKPIs from 'in-events/components/EventDetailsKPIs';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import EventChart from 'in-events/components/EventChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import { emptyList } from 'in-services/fixedImmutables';
import Card from 'in-new-components/Card';

import locals from './Summary.mless';

export default function Summary({ selectedEventId, data: event }) {
  if (!event || selectedEventId !== event.get('id')) {
    return <LoadingIndicator type="dark" />;
  }

  const eventType = getEventType(event);
  const isIncident = eventType === EVENT_TYPES.INCIDENT;
  let content;
  if (isIncident) {
    content = <LegacyIncidentContent event={event} />;
  } else {
    content = <LegacyEventContent event={event} />;
  }
  return (
    <HeightRestrictedView
      render={() => (
        <ContentWrapper>
          <EventDetailsKPIs event={event} />
          {isIncident ? <IncidentContent incident={event} /> : <EventContent event={event} />}
          <Row>{content}</Row>
        </ContentWrapper>
      )}
    />
  );
}

function EventContent({ event }) {
  return (
    <>
      <Row>
        <Col xs>
          <Card title="Description">
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
          <Card title="Description">
            <PopulationChart incidentId={incident.get('id')} />
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
