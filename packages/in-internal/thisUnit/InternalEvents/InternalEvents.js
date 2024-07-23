/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Link, Button } from '@instana/components';

import EntityWithParentInformation from 'in-events/components/EntityInformation/EntityWithParentInformation';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import getInternalEvents from 'in-subscription/getInternalEvents';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { formatDateTime } from 'in-services/formatters/date';
import ExpandableCard from 'in-components/ExpandableCard';
import { Col, Row } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './InternalEvents.mless';

export default function InternalEventsList() {
  const timeConfig = useTimeConfig();
  const { items, loadMore, canLoadMore } = useCursorPagination(
    ({ cursor }) =>
      getInternalEvents({
        timeConfig,
        pagination: {
          cursor,
          retrievalSize: 10
        },
        order: {
          by: 'start',
          direction: 'DESC'
        }
      }),
    [timeConfig]
  );

  if (!items) {
    return (
      <div className={locals.wrapper}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className={locals.wrapper}>
      <h1 className={locals.header}>{t('in-internal:monitoringUnit.thisUnit.internalEvents.internalEvent')}</h1>

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
            {t('in-internal:monitoringUnit.thisUnit.internalEvents.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}

function Event({ event, timeConfig }) {
  const cardPreview = (
    <>
      <Tooltip align="topMiddle" content={t('in-internal:monitoringUnit.thisUnit.internalEvents.triggerTimeIssue')}>
        <span className={locals.duration}>{formatDateTime(event.start)}</span>
      </Tooltip>
      <span className={locals.title}>{event.type + ' - ' + event.state}</span>
    </>
  );
  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
  const linkHref = getEventsViewFilteredBy({
    query: '',
    eventId: event.id
  });

  return (
    <ExpandableCard title={cardPreview} openByDefault={false}>
      <Row verticallyStretchColumns>
        <Col lg={1}>
          <span className={locals.title}>{t('in-internal:monitoringUnit.thisUnit.internalEvents.issueLink')}</span>
        </Col>
        <Col>
          <Link className={locals.title} href={linkHref}>
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
              <span className={locals.title}>{t('in-internal:monitoringUnit.thisUnit.internalEvents.category')}</span>
            </Col>
            <Col>
              <span className={locals.text}>{event.metadata['agent_monitoring_category']}</span>
            </Col>
          </Row>
          <Row verticallyStretchColumns>
            <Col lg={1}>
              <span className={locals.title}>{t('in-internal:monitoringUnit.thisUnit.internalEvents.code')}</span>
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
