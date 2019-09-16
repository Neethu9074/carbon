import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewSwitcher from 'in-events/components/ViewSwitcher';
import EventsChart from 'in-events/components/EventsChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function EventViewInternal({ location }) {
  const eventType = getMatrixParameter(location, eventsPath, 'view');
  const eventId = getMatrixParameter(location, eventsPath, 'eventId');

  return (
    <Sticky header={<SearchBar />}>
      <Title title="Events" />
      <Sticky header={<ViewSwitcher selectedEventType={eventType} darkTheme />}>
        {eventId ? (
          <EventTable eventType={eventType} selectedEventId={eventId} />
        ) : (
          <MaxWidthFullscreenContainer>
            <Row>
              <Col lg={12}>
                <EventsChart />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <EventTable eventType={eventType} />
              </Col>
            </Row>
          </MaxWidthFullscreenContainer>
        )}
      </Sticky>
    </Sticky>
  );
}
