import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewSwitcher from 'in-events/components/ViewSwitcher';
import EventsChart from 'in-events/components/EventsChart';
import { Row, Col } from 'in-new-components/layout/Grid';
import EventTable from 'in-events/components/EventTable';
import { eventsPath } from 'in-events/navigation/paths';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { timeConfig$ } from 'in-stores/time/config';
import { query$ } from 'in-stores/search/query';
import cursorPaginated from 'in-hoc/cursorPaginated';
import withUrlState from 'in-hoc/withUrlState';
import { eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter } from 'in-events/navigation/urlParameters';
import getRawEvents from 'in-subscription/getRawEvents';
import connect from 'in-hoc/connectTo';

export default function LegacyEventViewMigration(props) {
  const legacyEventIdQueryParam = get(props, ['location', 'query', 'eventId']);
  if (legacyEventIdQueryParam) {
    return (
      <RedirectWithHash
        to$={getEventsViewFilteredBy({
          eventTypeFilter: getMatrixParameter(props.location, eventsPath, 'view'),
          eventId: legacyEventIdQueryParam
        })}
      />
    );
  }

  return <EventView {...props} />;
}

const EventView = compose(
  connect({
    timeConfig: timeConfig$,
    query: query$
  }),
  withUrlState({
    bind: [eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter],
    reducerName: 'onChange'
  }),
  cursorPaginated({
    getResettingProps: () => ['orderBy', 'orderDirection', 'eventType', 'timeConfig', 'query'],
    get: ({ cursor, orderBy, orderDirection, timeConfig, query, eventType }) =>
      getRawEvents({
        timeConfig,
        query: concatQueries(query, eventType),
        pagination: {
          cursor,
          retrievalSize: 30
        },
        order: {
          by: orderBy,
          direction: orderDirection
        }
      })
  })
)(EventViewComponent);
function EventViewComponent(props) {
  const eventType = getMatrixParameter(props.location, eventsPath, 'view');
  const eventId = getMatrixParameter(props.location, eventsPath, 'eventId');

  return (
    <Sticky header={<SearchBar />}>
      <Title title="Events" />
      <Sticky header={<ViewSwitcher selectedEventType={eventType} darkTheme />}>
        {eventId ? (
          <EventTable {...props} eventType={eventType} selectedEventId={eventId} />
        ) : (
          <MaxWidthFullscreenContainer>
            <Row>
              <Col lg={12}>
                <EventsChart eventType={eventType} time={props.time} />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <EventTable {...props} eventType={eventType} />
              </Col>
            </Row>
          </MaxWidthFullscreenContainer>
        )}
      </Sticky>
    </Sticky>
  );
}

function concatQueries(userQuery, eventFilter) {
  if (userQuery && eventFilter) {
    return `(${userQuery}) AND (event.type:${eventFilter})`;
  } else if (!userQuery && eventFilter) {
    return `event.type:${eventFilter}`;
  } else if (userQuery && !eventFilter) {
    return userQuery;
  }
  return '';
}
