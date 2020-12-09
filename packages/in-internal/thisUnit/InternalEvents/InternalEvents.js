import React, { Fragment } from 'react';
import { compose } from 'recompose';

import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import getInternalEvents from 'in-subscription/getInternalEvents';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { formatDateTime } from 'in-services/formatters/date';
import { Col, Row } from 'in-new-components/layout/Grid';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './InternalEvents.mless';

export default compose(
  connect({ timeConfig: timeConfig$ }),
  cursorPaginated({
    getResettingProps: () => ['timeConfig'],
    get: ({ timeConfig, cursor }) => {
      return getInternalEvents({
        timeConfig,
        pagination: {
          cursor,
          retrievalSize: 10
        },
        order: {
          by: 'start',
          direction: 'DESC'
        }
      });
    }
  })
)(InternalEventsList);

function InternalEventsList(props) {
  const { items, loadMore, canLoadMore, timeConfig } = props;

  if (!items) {
    return (
      <div className={locals.wrapper}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className={locals.wrapper}>
      <h1 className={locals.header}>Internal Events</h1>

      {items.map(event => (
        <Row key={event.id} verticallyStretchColumns>
          <Col lg={12}>
            <Event event={event} timeConfig={timeConfig} />
          </Col>
        </Row>
      ))}

      {canLoadMore && (
        <div className={locals.loadMoreButton}>
          <Button
            kind="action"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              loadMore();
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

function Event({ event, timeConfig }) {
  const cardPreview = (
    <>
      <Tooltip align="topMiddle" content="Triggering time of issue">
        <span className={locals.duration}>{formatDateTime(event.triggeringTime)}</span>
      </Tooltip>
      <span className={locals.title}>{event.type + ' - ' + event.state}</span>
    </>
  );

  return (
    <ExpandableCard title={cardPreview} framed openByDefault={false}>
      <Row verticallyStretchColumns>
        <Col lg={1}>
          <span className={locals.title}>Issue link:</span>
        </Col>
        <Col>
          <Link
            className={locals.title}
            href$={getEventsViewFilteredBy({
              query: '',
              eventId: event.id
            })}
          >
            {event.type + ' - ' + event.state}
          </Link>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={2}>
          <EntityWithParentInformation
            entityId={event.entityId}
            entityType={event.entityType}
            metadata={event.metadata}
            timeConfig={timeConfig}
            linkTimeConfig={getTimeConfigFromEvent(event)}
          />
        </Col>
      </Row>
      {event.metadata && (
        <Fragment>
          <Row verticallyStretchColumns>
            <Col lg={1}>
              <span className={locals.title}>Category:</span>
            </Col>
            <Col>
              <span className={locals.text}>{event.metadata['agent_monitoring_category']}</span>
            </Col>
          </Row>
          <Row verticallyStretchColumns>
            <Col lg={1}>
              <span className={locals.title}>Code:</span>
            </Col>
            <Col>
              <span className={locals.text}>{event.metadata['agent_monitoring_code']}</span>
            </Col>
          </Row>
        </Fragment>
      )}
    </ExpandableCard>
  );
}
