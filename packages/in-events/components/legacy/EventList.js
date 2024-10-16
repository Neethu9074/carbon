/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import {
  Card,
  Pagination as CarbonPagination,
  Stack,
  Typography,
  Collapsible,
  CarbonLayer,
  Button,
  IconButton
} from '@instana/components';
import { combineLatest } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  carbonPaginationEnabled,
  manuallyCloseEventEnabled,
  eventFeedbackEnabled,
  businessObservabilityEnabled
} from 'in-services/featureFlags';
import IncidentActions from 'in-events/components/IncidentPage/IncidentOverview/IncidentActions';
import LegacyRootCauseSection from 'in-events/components/legacy/LegacyRootCauseSection';
import ImpactedBusinessProcesses from 'in-events/components/ImpactedBusinessProcesses';
import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import RootCauseSection from 'in-events/components/legacy/RootCauseSection';
import PopulationChart from 'in-events/components/legacy/PopulationChart';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import EventListItem from 'in-events/components/legacy/EventListItem';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { getEventViewWithTimeFocusedAt } from './EventListItem';
import { CombinedEventListItemContent } from './EventListItem';
import { toHtml } from 'in-services/formatters/markdown';
import { rcaUIEnabled } from 'in-services/featureFlags';
import { emptyList } from 'in-services/fixedImmutables';
import { EventListItemSkeleton } from './EventListItem';
import EventEntityDetails from './EventEntityDetails';
import { Row, Col } from 'in-components/layout/Grid';
import EventDetailsKPIs from '../EventDetailsKPIs';
import { FeedbackComponents } from '../EventTable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Pagination from 'in-components/Pagination';
import { getEventType } from 'in-stores/events';
import { EVENT_TYPES } from 'in-stores/events';
import { getEvent } from 'in-stores/events';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './EventList.mless';

export default function IncidentEventList({ incident, latestSnapshot, snapshot }) {
  const triggeringEvent = useObservable(getEvent(incident.getIn(['triggeringEvent'], '')), [incident]) ?? null;
  const triggeringEventId = triggeringEvent?.get('id') || '';

  const incidentHasRCAProperty =
    incident.hasIn(['metadata', 'probableRootCause']) && !incident.getIn(['metadata', 'probableRootCause']).isEmpty();

  const triggeringProblemId = incident.getIn(['problem', 'id']);

  const eventType = getEventType(incident);
  const rootCauseHasOldSnapshotMetadata = incident.hasIn([
    'metadata',
    'rootCause',
    'probableRootCauseSnapshotMetadata'
  ]);

  if (!triggeringEvent) return <LoadingIndicator />;
  return (
    <>
      {/* Event Details KPIs */}
      <EventDetailsKPIs event={incident} isIncident />

      {/* Incident overview */}
      <IncidentOverview
        incident={incident}
        triggeringEvent={triggeringEvent}
        latestSnapshot={latestSnapshot}
        triggeringProblemId={triggeringProblemId}
        triggeringEventId={triggeringEventId}
      />

      {/* RCA */}
      {incidentHasRCAProperty && rcaUIEnabled && rootCauseHasOldSnapshotMetadata && (
        <LegacyRootCauseSection
          title={t('in-events:RCA.titlePRCA')}
          incident={incident}
          latestSnapshot={latestSnapshot}
          incidentHasRCAProperty={incidentHasRCAProperty}
        />
      )}

      {rcaUIEnabled && !rootCauseHasOldSnapshotMetadata && (
        <RootCauseSection title={t('in-events:RCA.titlePRCA')} incident={incident} latestSnapshot={latestSnapshot} />
      )}

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

const IncidentOverview = ({ incident, triggeringEvent, latestSnapshot, triggeringProblemId, triggeringEventId }) => {
  const colourForCard = getTriggeringEventCardColor(incident);
  const { location, createHref } = useNavigation();
  const { windowSize } = useTimeConfig();
  const timeConfigLink = createHref(
    getEventViewWithTimeFocusedAt(incident.get('start'), windowSize, location, incident.get('id'), incident.get('type'))
  );

  return (
    <Row withoutSideMargin>
      <Col xs>
        {colourForCard && <div className={locals.cardIndicator} style={{ background: colourForCard }} />}
        <Card
          useMaxAvailableHeight={false}
          title={t('in-events:incident.overviewTitle')}
          rightHeaderContent={
            <>
              <IconButton
                kind="subtle"
                data-testid="restroreConfigButton"
                type="lib_datetime_time"
                isWrapperedByTooltip
                iconDescription={t('in-events:incident.setTimeConfig')}
                href={timeConfigLink}
                align="left"
                iconSize="xs"
              />
            </>
          }
        >
          <TriggeringEvent incident={incident} triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} />
        </Card>
        {/* Metric violations */}
        <MetricViolations triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} incident={incident} />
        {/* Related events */}
        <RelatedEvents
          incident={incident}
          triggeringProblemId={triggeringProblemId}
          latestSnapshot={latestSnapshot}
          triggeringEventId={triggeringEventId}
        />
        {eventFeedbackEnabled && incident && (
          <div className={locals.feedbackContainer}>
            <FeedbackComponents eventData={incident} />
          </div>
        )}
      </Col>
    </Row>
  );
};

const TriggeringEvent = ({ incident, triggeringEvent, latestSnapshot }) => {
  const canCloseManually = manuallyCloseEventEnabled && role?.canManuallyCloseIssue;
  const timeConfig = canCloseManually && incident ? getTimeConfigForSnapshotRetrieval(incident, latestSnapshot) : null;

  return (
    <Stack gap="xsmall">
      <Typography variant="heading-200">{t('in-events:titleTriggerEvent')}</Typography>
      <Stack direction="horizontal" align="center">
        <div className={locals.noShrink} style={{ flexShrink: 0 }}>
          <Typography variant="heading-100" noMargin>
            {t('in-events:titleDescription')}:
          </Typography>
        </div>
        <DangerousHtmlPresenter
          className={locals.descriptionText}
          html={toHtml(triggeringEvent.getIn(['problem', 'fixSuggestion']))}
        />
      </Stack>
      <Stack direction="horizontal" align="center">
        <Typography variant="heading-100" noMargin>
          {t('in-events:incident.triggeringEntity')}:
        </Typography>
        <EventEntityDetails
          shouldDisplayDefaultLabel={false}
          triggeringEvent={triggeringEvent}
          timeConfig={timeConfig}
        />
      </Stack>
      <Stack direction="horizontal" align="center">
        {/* Incident actions */}
        <IncidentActions incident={incident} triggeringEvent={triggeringEvent} latestSnapshot={latestSnapshot} />
      </Stack>
    </Stack>
  );
};

const MetricViolations = ({ triggeringEvent, latestSnapshot, incident }) => {
  const rcaFound = incident.getIn(['rca', 'found'], false);
  return (
    <div className={locals.layerBackground}>
      <CarbonLayer>
        {/* TODO: determine if RCA is valid, if valid, hide the chart */}
        <Collapsible initiallyOpen={!rcaFound}>
          <Collapsible.Header>{t('in-events:incident.metricViolationTitle')}</Collapsible.Header>
          <Collapsible.Content>
            <div className={locals.metricViolationsContainer}>
              <CombinedEventListItemContent event={triggeringEvent} latestSnapshot={latestSnapshot} justChart />
            </div>
          </Collapsible.Content>
        </Collapsible>
      </CarbonLayer>
    </div>
  );
};

const RelatedEvents = ({ incident, triggeringProblemId, latestSnapshot, triggeringEventId }) => {
  // TODO: add back setChangesAreVisible
  const [changesAreVisible, setChangesAreVisible] = useState(true);

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

  const [relatedEventsPage, setRelatedEventsPage] = useState(1);
  const [relatedEventsSection, setRelatedEventsSection] = useState(false);

  const pageSize = 5;
  const paginatedRecentEventIds = allRecentEvents?.slice(
    pageSize * (relatedEventsPage - 1),
    pageSize * relatedEventsPage
  );
  const paginatedRecentEventsRaw =
    useObservable(combineLatest(paginatedRecentEventIds.map(getEvent)).throttle(250), [relatedEventsPage]) ?? null;

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

  if (!paginatedRecentEvents && totalRecentEvents.length === 0) return <LoadingIndicator />;

  return (
    <div className={locals.layerBackground}>
      <CarbonLayer>
        <Collapsible initiallyOpen={relatedEventsSection} onOpen={() => setRelatedEventsSection(!relatedEventsSection)}>
          <Collapsible.Header>
            {t('in-events:titleRelatedEvents', {
              eventCount: totalRecentEvents
            })}
          </Collapsible.Header>
          <Collapsible.Content>
            <LeftRightPadding>
              <Stack align="end">
                <ChangesButton
                  recentEvents={paginatedRecentEventsRaw}
                  changesAreVisible={changesAreVisible}
                  setChangesAreVisible={setChangesAreVisible}
                />
              </Stack>
              <PopulationChart
                incidentId={incident.get('id')}
                recentEvents={paginatedRecentEvents}
                changesAreVisible={changesAreVisible}
                setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
                setHighlightEventOnHover={setHighlightEventOnHover}
              />
              {allRecentEvents.length !== 0 && !paginatedRecentEvents && <LoadingIndicator size="xl" />}
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
              {allRecentEvents.length !== 0 &&
                !paginatedRecentEvents &&
                Array(pageSize).map((val, idx) => <EventListItemSkeleton id={idx} />)}
              {carbonPaginationEnabled && totalRecentEvents > pageSize ? (
                <CarbonPagination
                  currentPage={relatedEventsPage}
                  totalItems={totalRecentEvents}
                  pageSize={pageSize}
                  pageSizes={[pageSize]}
                  onChange={data => {
                    setRelatedEventsPage(data.page);
                  }}
                />
              ) : (
                <Pagination
                  currentPage={relatedEventsPage}
                  numPages={numPages}
                  onChange={page => setRelatedEventsPage(page)}
                />
              )}
            </LeftRightPadding>
          </Collapsible.Content>
        </Collapsible>
      </CarbonLayer>
    </div>
  );
};

const ChangesButton = ({ recentEvents, changesAreVisible, setChangesAreVisible }) => {
  const numChanges = getNumberOfChanges(recentEvents);

  if (numChanges === 0) {
    return <></>;
  }

  return (
    <Button
      type="button"
      kind={changesAreVisible ? 'primaryv2' : 'secondary'}
      onClick={() => setChangesAreVisible(!changesAreVisible)}
      // icon={changesAreVisible ? 'lib_views_hide' : 'lib_views_show'}
    >
      {changesAreVisible ? t('in-events:buttonHideChanges') : t('in-events:buttonShowChanges')}
    </Button>
  );
};

const getNumberOfChanges = recentEvents => {
  if (!recentEvents) {
    return 0;
  }
  return recentEvents.filter(event => getEventType(event) === EVENT_TYPES.CHANGE).length;
};

const RelatedEventsEmptyState = () => (
  <div className={locals.layerBackground}>
    <CarbonLayer>
      <Collapsible>
        <Collapsible.Header>
          {t('in-events:titleRelatedEvents', {
            eventCount: 0
          })}
        </Collapsible.Header>
        <Collapsible.Content>
          <LeftRightPadding>
            <NoDataAvailable text={t('in-events:noRelatedEvents')} />
          </LeftRightPadding>
        </Collapsible.Content>
      </Collapsible>
    </CarbonLayer>
  </div>
);

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
