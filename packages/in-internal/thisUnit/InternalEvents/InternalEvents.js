import { compose } from 'recompose';
import React from 'react';

import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import getInternalEvents from 'in-subscription/getInternalEvents';
import LoadingIndicator from 'in-components/LoadingIndicator';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { formatDateTime } from 'in-services/formatters/date';
import { Col, Row } from 'in-new-components/layout/Grid';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import Code from 'in-components/Code';

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
          retrievalSize: 5 // Low retrieval size because might fetch relatively large logs
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
  const { items, loadMore, canLoadMore } = props;

  if (!items) {
    return (
      <div className={locals.wrapper}>
        <LoadingIndicator type="dark" />
      </div>
    );
  }

  return (
    <div className={locals.wrapper}>
      <h1 className={locals.header}>Internal Events</h1>

      {items.map(event => (
        <Row key={event.id} verticallyStretchColumns>
          <Col lg={12}>
            <Event event={event} />
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

function Event({ event }) {
  const cardPreview = (
    <>
      <Tooltip align="topMiddle" content="Timestamp of issue">
        <span className={locals.duration}>{formatDateTime(event.timestamp)}</span>
      </Tooltip>
      <span className={locals.title}>{event.title + ' - ' + event.errorText}</span>
    </>
  );

  return (
    <ExpandableCard title={cardPreview} framed={true} openByDefault={false}>
      <Row verticallyStretchColumns>
        <Col lg={1}>
          <span className={locals.title}>Issue link:</span>
        </Col>
        <Col>
          <Link
            className={locals.title}
            href$={getEventsViewFilteredBy({
              query: '',
              eventId: event.id,
              eventTypeFilter: 'issue'
            })}
          >
            {event.title + ' - ' + event.errorText}
          </Link>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        <Col lg={1}>
          <span className={locals.title}>PID:</span>
        </Col>
        <Col>
          <span className={locals.text}>{event.pid}</span>
        </Col>
      </Row>
      {event.logs &&
        Object.keys(event.logs).map(log => (
          <Row key={log} verticallyStretchColumns>
            <Col lg={12}>
              <span className={locals.logTitle}>{log}:</span>
              <Code className={locals.log} showLineNumbers={false} code={event.logs[log]} />
            </Col>
          </Row>
        ))}
    </ExpandableCard>
  );
}
