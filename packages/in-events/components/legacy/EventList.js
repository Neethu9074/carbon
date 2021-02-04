/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import { t } from 'in-i18n';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { Row, Col } from 'in-new-components/layout/Grid';
import { emptyList } from 'in-services/fixedImmutables';
import { getEvent } from 'in-stores/events';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

import 'in-events/components/legacy/EventList.less';

const block = 'in-event-view-incident-event-list';

export default connectTo(
  ({ incident }) => ({
    events: combineLatest(
      incident
        .get('recentEvents', emptyList)
        .toArray()
        .map(getEvent)
    )
      .map(events =>
        events
          .filter(e => e && !e.isEmpty())
          .sort(
            (a, b) =>
              incident.getIn(['issueOrderMap', a.get('id')], a.get('start')) -
              incident.getIn(['issueOrderMap', b.get('id')], b.get('start'))
          )
      )
      .throttle(250)
  }),
  function IncidentEventList({ events, incident }) {
    if (!events) {
      return <ListRow title={t('in-events:titleTriggerEvent')} />;
    }

    const triggeringProblemId = incident.getIn(['problem', 'id']);

    const isTriggeringEvent = ev => ev.getIn(['problem', 'id']) === triggeringProblemId;

    return (
      <>
        <ListRow
          title={t('in-events:titleTriggerEvent')}
          events={events.filter(isTriggeringEvent)}
          triggeringProblemId={triggeringProblemId}
        />
        <ListRow
          title={t('in-events:titleRelatedEvents', {
            eventCount: events.length - 1
          })}
          events={events.filter(ev => !isTriggeringEvent(ev))}
          triggeringProblemId={triggeringProblemId}
        />
      </>
    );
  }
);

function ListRow({ title, events, triggeringProblemId }) {
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card title={title}>
          <div className={`${block}__timeline`}>
            {!events && <LoadingIndicator />}
            {events?.map(_event => (
              <EventListItem key={_event.get('id')} triggeringProblemId={triggeringProblemId} event={_event} />
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
}
