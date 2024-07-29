/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Card, Pagination as CarbonPagination } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import ManualCloseIssueButton from 'in-events/components/tabs/Summary/ManualCloseIssueButton';
import LegacyRootCauseSection from 'in-events/components/legacy/LegacyRootCauseSection';
import ImpactedBusinessProcesses from 'in-events/components/ImpactedBusinessProcesses';
import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import RootCauseSection from 'in-events/components/legacy/RootCauseSection';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { carbonPaginationEnabled } from 'in-services/featureFlags';
import { getEventSeverityLabelWithEventType } from 'in-stores/events';
import { manuallyCloseEventEnabled } from 'in-services/featureFlags';
import { emptyList } from 'in-services/fixedImmutables';
import { rcaUIEnabled } from 'in-services/featureFlags';
import EventIcon from 'in-events/components/EventIcon';
import { Row, Col } from 'in-components/layout/Grid';
import Pagination from 'in-components/Pagination';
import { getEventType } from 'in-stores/events';
import { getEvent } from 'in-stores/events';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './EventList.mless';

export default function IncidentEventList({
  incident,
  recentEvents,
  pageState,
  setPageURLState,
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

  const oldRootCausePropertyCheck =
    incident.hasIn(['metadata', 'probableRootCause']) && !incident.getIn(['metadata', 'probableRootCause']).isEmpty();

  const newRootCausePropertyCheck =
    incident.hasIn(['metadata', 'rootCause']) && !incident.getIn(['metadata', 'rootCause']).isEmpty();
  const incidentHasRCAProperty = useMemo(
    () => oldRootCausePropertyCheck || newRootCausePropertyCheck,
    [newRootCausePropertyCheck, oldRootCausePropertyCheck]
  );

  const triggeringProblemId = incident.getIn(['problem', 'id']);

  const eventType = getEventType(incident);
  const pageSize = 10;
  const rootCauseHasOldSnapshotMetadata = incident.hasIn([
    'metadata',
    'rootCause',
    'probableRootCauseSnapshotMetadata'
  ]);
  if (!triggeringEvent) return <ListRow title={t('in-events:titleTriggerEvent')} />;
  return (
    <>
      {incidentHasRCAProperty && rcaUIEnabled && rootCauseHasOldSnapshotMetadata && (
        <LegacyRootCauseSection
          title={t('in-events:RCA.titlePRCA')}
          incident={incident}
          latestSnapshot={latestSnapshot}
          incidentHasRCAProperty={incidentHasRCAProperty}
        />
      )}

      {incidentHasRCAProperty && rcaUIEnabled && !rootCauseHasOldSnapshotMetadata && (
        <RootCauseSection
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
        incident={incident}
      />
      <PaginatedListRow
        currentSetOfEvents={recentEvents.filter(e => e.get('id') !== triggeringEvent.get('id'))}
        title={t('in-events:titleRelatedEvents', {
          eventCount: relatedEvents.length
        })}
        currentPage={pageState}
        numPages={Math.ceil(relatedEvents.length / pageSize)}
        totalItems={relatedEvents.length}
        pageSize={pageSize}
        onChange={({ page }) => {
          setPageURLState({ relatedEventsPage: page });
        }}
        triggeringProblemId={triggeringProblemId}
        latestSnapshot={latestSnapshot}
        expandedEventOnClickInTimeline={expandedEventOnClickInTimeline}
        setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
        highlightEventOnHover={highlightEventOnHover}
      />
      <AutomationCard volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={triggeringEvent?.toJS()} />
      <ImpactedBusinessProcesses
        eventType={eventType}
        entityType={incident?.get('entityType', undefined)}
        entityId={incident?.get('entityId', undefined)}
      />
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
  highlightEventOnHover,
  totalItems,
  pageSize
}) {
  if (!currentSetOfEvents) return <LoadingIndicator />;

  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card title={title}>
          {currentSetOfEvents?.map(_event => (
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
          {carbonPaginationEnabled && totalItems > pageSize ? (
            <CarbonPagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              pageSizes={[pageSize]}
              onChange={data => {
                onChange({ page: data.page });
              }}
            />
          ) : (
            <Pagination currentPage={currentPage} numPages={numPages} onChange={page => onChange({ page })} />
          )}
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
  highlightEventOnHover,
  incident
}) {
  const canCloseManually = manuallyCloseEventEnabled && role?.canManuallyCloseIssue;
  const timeConfig = canCloseManually && incident ? getTimeConfigForSnapshotRetrieval(incident, latestSnapshot) : null;
  const header = renderTriggeringEventHeader(incident, canCloseManually, timeConfig);
  let colourForCard = getTriggeringEventCardColor(incident);

  return (
    <Row withoutSideMargin>
      <Col xs>
        {title === t('in-events:titleTriggerEvent') && colourForCard && (
          <div className={locals.cardIndicator} style={{ background: colourForCard }} />
        )}
        <Card title={title} header={header}>
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

function getTriggeringEventCardColor(incident) {
  const incidentSeverity = incident ? incident.getIn(['problem', 'severity'], 5) : null;
  const incidentStatus = incident ? incident.get('state', 'closed') : null;

  let colorForCard;

  if (incidentStatus === 'closed' || incidentStatus === 'manually_closed') {
    colorForCard = themes.default.ids.color.option.neutral[500];
  } else if (incidentSeverity === 5) {
    colorForCard = themes.default.ids.color.option.yellow[500];
  } else if (incidentSeverity > 5) {
    colorForCard = themes.default.ids.color.option.red[500];
  }
  return colorForCard;
}

function renderTriggeringEventHeader(incident, canCloseManually, timeConfig) {
  return incident && canCloseManually ? (
    <ManualCloseIssueButton
      buttonKind={'primary'}
      eventType="incident"
      event={incident}
      iconComponent={
        <EventIcon event={incident} tooltipLabel={getEventSeverityLabelWithEventType(incident, timeConfig)} />
      }
    />
  ) : null;
}
