/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';

import { Card, Pagination as CarbonPagination, Button } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  carbonPaginationEnabled,
  manuallyCloseEventEnabled,
  eventFeedbackEnabled,
  businessObservabilityEnabled
} from 'in-services/featureFlags';
import ManualCloseIssueButton from 'in-events/components/tabs/Summary/ManualCloseIssueButton';
import LegacyRootCauseSection from 'in-events/components/legacy/LegacyRootCauseSection';
import ImpactedBusinessProcesses from 'in-events/components/ImpactedBusinessProcesses';
import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import { EVENT_TYPES, getEventSeverityLabelWithEventType } from 'in-stores/events';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import RootCauseSection from 'in-events/components/legacy/RootCauseSection';
import PopulationChart from 'in-events/components/legacy/PopulationChart';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { pageNumberUrlParameter } from '../../navigation/urlParameters';
import EventListItem from 'in-events/components/legacy/EventListItem';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { rcaUIEnabled } from 'in-services/featureFlags';
import { emptyList } from 'in-services/fixedImmutables';
import EventIcon from 'in-events/components/EventIcon';
import { Row, Col } from 'in-components/layout/Grid';
import EventDetailsKPIs from '../EventDetailsKPIs';
import { FeedbackComponents } from '../EventTable';
import Pagination from 'in-components/Pagination';
import { getEventType } from 'in-stores/events';
import useUrlState from 'in-hooks/useUrlState';
import { getEvent } from 'in-stores/events';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './EventList.mless';

export default function IncidentEventList({ incident, latestSnapshot, snapshot }) {
  const triggeringEvent = useObservable(getEvent(incident.getIn(['triggeringEvent'], '')), [incident]) ?? null;
  const triggeringEventId = triggeringEvent?.get('id') || '';

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
  const rootCauseHasOldSnapshotMetadata = incident.hasIn([
    'metadata',
    'rootCause',
    'probableRootCauseSnapshotMetadata'
  ]);

  // const [highlightEventOnHover, setHighlightEventOnHover] = useState('');

  if (!triggeringEvent) return <LoadingIndicator />;
  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card>
            {eventFeedbackEnabled && incident && <FeedbackComponents eventData={incident} textVariant="body-large" />}
          </Card>
        </Col>
      </Row>
      {/* Event Details KPIs */}
      <EventDetailsKPIs event={incident} isIncident />

      {/* Triggered event */}
      <TriggeringEvent incident={incident} triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} />
      {/* RCA */}
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

      {/* Related events */}
      <RelatedEvents
        incident={incident}
        triggeringProblemId={triggeringProblemId}
        latestSnapshot={latestSnapshot}
        triggeringEventId={triggeringEventId}
      />

      {/* Automations */}
      <AutomationCard volatileId={snapshot?.get('volatileId')?.toJS() ?? {}} event={triggeringEvent?.toJS()} />
      {/* Business impact */}
      {businessObservabilityEnabled && (
        <ImpactedBusinessProcesses
          eventType={eventType}
          entityType={incident?.get('entityType', undefined)}
          entityId={incident?.get('entityId', undefined)}
        />
      )}
    </>
  );
}

const TriggeringEvent = ({ incident, triggeringEvent, latestSnapshot }) => {
  const colourForCard = getTriggeringEventCardColor(incident);
  const canCloseManually = manuallyCloseEventEnabled && role?.canManuallyCloseIssue;
  const timeConfig = canCloseManually && incident ? getTimeConfigForSnapshotRetrieval(incident, latestSnapshot) : null;
  const header = renderTriggeringEventHeader(incident, canCloseManually, timeConfig);

  return (
    <Row withoutSideMargin>
      <Col xs>
        {colourForCard && <div className={locals.cardIndicator} style={{ background: colourForCard }} />}
        <Card title={t('in-events:titleTriggerEvent')} rightHeaderContent={header}>
          <Row>
            <Col xs>
              {!triggeringEvent && <LoadingIndicator />}
              <EventListItem
                triggeringProblemId={incident.getIn(['problem', 'id'])}
                event={triggeringEvent}
                latestSnapshot={latestSnapshot}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

const RelatedEvents = ({ incident, triggeringProblemId, latestSnapshot, triggeringEventId }) => {
  const [changesAreVisible, setChangesAreVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // recent events
  const allRecentEvents = incident
    .get('recentEvents', emptyList)
    .sort(
      (a, b) =>
        incident.getIn(['issueOrderMap', a], Number.MAX_SAFE_INTEGER) -
        incident.getIn(['issueOrderMap', b], Number.MAX_SAFE_INTEGER)
    )
    .filter(_eid => _eid !== triggeringEventId)
    .toArray();

  const totalRecentEvents = allRecentEvents.length;

  // START related events pagination

  const [{ relatedEventsPage }, setPageURLState] = useUrlState({
    bind: [pageNumberUrlParameter],
    replaceHistory: false
  });

  const onPageChange = ({ page }) => setPageURLState({ relatedEventsPage: page });

  const currentPage = eventsPath && relatedEventsPage ? relatedEventsPage : 1;
  const pageSize = 5;
  const paginatedRecentEventIds = allRecentEvents?.slice(pageSize * (currentPage - 1), pageSize * currentPage);
  const paginatedRecentEventsRaw =
    useObservable(combineLatest(paginatedRecentEventIds.map(getEvent)).throttle(250), [incident]) ?? null;

  const paginatedRecentEvents = paginatedRecentEventsRaw?.filter(event => {
    if (!changesAreVisible && getEventType(event) === EVENT_TYPES.CHANGE) {
      return false;
    }
    return true;
  });

  const [expandedEventOnClickInTimeline, setExpandedEventOnClickInTimeline] = useState('');
  const numPages = Math.ceil(totalRecentEvents / pageSize);

  // END related events pagination

  const [highlightEventOnHover, setHighlightEventOnHover] = useState('');

  if (allRecentEvents.length === 0) {
    return <RelatedEventsEmptyState />;
  }

  if (!paginatedRecentEvents) return <LoadingIndicator />;

  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card
          title={t('in-events:titleRelatedEvents', {
            eventCount: totalRecentEvents
          })}
          rightHeaderContent={
            <IncidentSummarizationHeader
              recentEvents={paginatedRecentEventsRaw}
              changesAreVisible={changesAreVisible}
              setChangesAreVisible={setChangesAreVisible}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          }
        >
          <>
            <PopulationChart
              incidentId={incident.get('id')}
              recentEvents={paginatedRecentEvents}
              changesAreVisible={changesAreVisible}
              setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
              setHighlightEventOnHover={setHighlightEventOnHover}
            />
            {paginatedRecentEvents?.map(_event => (
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
            {carbonPaginationEnabled && totalRecentEvents > pageSize ? (
              <CarbonPagination
                currentPage={currentPage}
                totalItems={totalRecentEvents}
                pageSize={pageSize}
                pageSizes={[pageSize]}
                onChange={data => {
                  onPageChange({ page: data.page });
                }}
              />
            ) : (
              <Pagination currentPage={currentPage} numPages={numPages} onChange={page => onPageChange({ page })} />
            )}
          </>
        </Card>
      </Col>
    </Row>
  );
};

const RelatedEventsEmptyState = () => (
  <Row withoutSideMargin>
    <Col xs>
      <Card
        title={t('in-events:titleRelatedEvents', {
          eventCount: 0
        })}
      >
        <NoDataAvailable text={t('in-events:noRelatedEvents')} />
      </Card>
    </Col>
  </Row>
);

// TODO: Move this to its own component
const IncidentSummarizationHeader = ({
  recentEvents,
  changesAreVisible,
  setChangesAreVisible,
  isExpanded,
  setIsExpanded
}) => {
  const numChanges = getNumberOfChanges(recentEvents);

  return (
    <>
      {shouldRenderExpandButton(recentEvents, numChanges) && (
        <Button type="button" kind={isExpanded ? 'primaryv2' : 'secondary'} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded
            ? t('in-events:buttonCollapse')
            : t('in-events:buttonExpandEvents', { eventsLength: recentEvents.length })}
        </Button>
      )}
      {numChanges > 0 && (
        <Button
          type="button"
          kind={changesAreVisible ? 'primaryv2' : 'secondary'}
          onClick={() => setChangesAreVisible(!changesAreVisible)}
        >
          {changesAreVisible ? t('in-events:buttonHideChanges') : t('in-events:buttonShowChanges')}
        </Button>
      )}
    </>
  );
};

const shouldRenderExpandButton = (recentEvents, changesAreVisible, numChanges) => {
  return recentEvents && recentEvents.length - (!changesAreVisible ? numChanges : 0) > 5;
};

function getNumberOfChanges(recentEvents) {
  if (!recentEvents) {
    return 0;
  }

  let counter = 0;
  for (let i = 0, length = recentEvents.length; i < length; i++) {
    const event = recentEvents[i];
    if (getEventType(event) === EVENT_TYPES.CHANGE) {
      counter++;
    }
  }
  return counter;
}

// END: IncidentSummarizationHeader

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
