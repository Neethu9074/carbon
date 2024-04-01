/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import ImpactedBusinessProcesses from 'in-events/components/ImpactedBusinessProcesses';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { pageNumberUrlParameter } from 'in-events/navigation/urlParameters';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import AIEventListRow from 'in-events/components/legacy/AIEventListRow';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { getEventType, getServiceIds } from 'in-stores/events';
import { emptyList } from 'in-services/fixedImmutables';
import { rcaUIEnabled } from 'in-services/featureFlags';
import { Row, Col } from 'in-components/layout/Grid';
import Pagination from 'in-components/Pagination';
import useUrlState from 'in-hooks/useUrlState';
import { getEvent } from 'in-stores/events';
import { t } from 'in-i18n';

export default function IncidentEventList({
  incident,
  latestSnapshot,
  snapshot,
  expandedEventOnClickInTimeline,
  setExpandedEventOnClickInTimeline,
  highlightEventOnHover
}) {
  const triggeringEvent = useObservable(getEvent(incident.getIn(['triggeringEvent'], '')), [incident]) ?? null;
  const relatedEvents = incident
    .get('recentEvents', emptyList)
    .sort(
      (a, b) =>
        incident.getIn(['issueOrderMap', a], Number.MAX_SAFE_INTEGER) -
        incident.getIn(['issueOrderMap', b], Number.MAX_SAFE_INTEGER)
    )
    .toArray()
    .filter(issue => issue !== incident.getIn(['triggeringEvent'], ''));

  const [{ relatedEventsPage }, setState] = useUrlState({
    bind: [pageNumberUrlParameter]
  });
  const [pageState, setPage] = useState(eventsPath && relatedEventsPage ? relatedEventsPage : 1);

  const incidentHasRCAProperty = useMemo(
    () =>
      incident.get('metadata').has('probableRootCause') && !incident.get('metadata').get('probableRootCause').isEmpty(),
    [incident]
  );
  if (!triggeringEvent) return <ListRow title={t('in-events:titleTriggerEvent')} />;

  const triggeringProblemId = incident.getIn(['problem', 'id']);

  const eventType = getEventType(incident);
  const serviceIds = getServiceIds(incident);
  const pageSize = 10;

  return (
    <>
      {incidentHasRCAProperty && rcaUIEnabled && (
        <AIEventListRow
          title={t('in-events:RCA.titlePRCA')}
          incident={incident}
          latestSnapshot={latestSnapshot}
          incidentHasRCAProperty={incidentHasRCAProperty}
        />
      )}

      <ListRow
        title={t('in-events:titleTriggerEvent')}
        events={[triggeringEvent]}
        triggeringProblemId={triggeringProblemId}
        latestSnapshot={latestSnapshot}
        expandedEventOnClickInTimeline={expandedEventOnClickInTimeline}
        setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
        highlightEventOnHover={highlightEventOnHover}
      />
      <PaginatedListRow
        currentSetOfEvents={relatedEvents.slice(pageSize * (relatedEventsPage - 1), pageSize * relatedEventsPage)}
        title={t('in-events:titleRelatedEvents', {
          eventCount: relatedEvents.length
        })}
        currentPage={pageState}
        numPages={Math.ceil(relatedEvents.length / pageSize)}
        onChange={({ page }) => {
          setPage(page);
          setState({ relatedEventsPage: page });
        }}
        triggeringProblemId={triggeringProblemId}
        latestSnapshot={latestSnapshot}
        expandedEventOnClickInTimeline={expandedEventOnClickInTimeline}
        setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
        highlightEventOnHover={highlightEventOnHover}
      />
      <AutomationCard volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={triggeringEvent?.toJS()} />
      <ImpactedBusinessProcesses eventType={eventType} serviceIds={serviceIds} />
    </>
  );
}

function PaginatedListRow({
  triggeringProblemId,
  currentSetOfEvents,
  title,
  currentPage,
  numPages,
  onChange,
  latestSnapshot,
  expandedEventOnClickInTimeline,
  setExpandedEventOnClickInTimeline,
  highlightEventOnHover
}) {
  const events =
    useObservable(
      combineLatest(currentSetOfEvents.map(getEvent))
        .map(events => events.filter(e => e && !e.isEmpty()))
        .throttle(250),
      [currentSetOfEvents]
    ) ?? null;

  if (!events) return <LoadingIndicator />;

  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card title={title}>
          {events.map(_event => (
            <EventListItem
              key={_event.get('id')}
              triggeringProblemId={triggeringProblemId}
              event={_event}
              latestSnapshot={latestSnapshot}
              expandedFromTimeline={expandedEventOnClickInTimeline === _event.get('id')}
              setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
              highlightEventOnHover={highlightEventOnHover === _event.get('id')}
            />
          ))}
          <Pagination currentPage={currentPage} numPages={numPages} onChange={page => onChange({ page })} />
        </Card>
      </Col>
    </Row>
  );
}

function ListRow({
  title,
  events,
  triggeringProblemId,
  latestSnapshot,
  expandedEventOnClickInTimeline,
  setExpandedEventOnClickInTimeline,
  highlightEventOnHover
}) {
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card title={title}>
          {!events && <LoadingIndicator />}
          {events?.map(_event => (
            <EventListItem
              key={_event.get('id')}
              triggeringProblemId={triggeringProblemId}
              event={_event}
              latestSnapshot={latestSnapshot}
              expandedFromTimeline={expandedEventOnClickInTimeline === _event.get('id')}
              setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
              highlightEventOnHover={highlightEventOnHover === _event.get('id')}
            />
          ))}
        </Card>
      </Col>
    </Row>
  );
}
