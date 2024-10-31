/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, CarbonLayer, Collapsible, Stack, Pagination as CarbonPagination } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Snapshot } from '@instana/types';

// @ts-expect-error no typedef available
import { EventListItemSkeleton } from 'in-events/components/legacy/EventListItem';
// @ts-expect-error no typedef available
import PopulationChart from 'in-events/components/legacy/PopulationChart';
// @ts-expect-error no typedef available
import { EVENT_TYPES, getEvent, getEventType } from 'in-stores/events';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import EventListItem from 'in-events/components/legacy/EventListItem';
import { carbonPaginationEnabled } from 'in-services/featureFlags';
import { emptyList } from 'in-services/fixedImmutables';
import Pagination from 'in-components/Pagination';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface RelatedEventProps {
  incident: EventOrMap;
  triggeringProblemId?: string;
  latestSnapshot: Snapshot;
  triggeringEventId?: string;
}

type TYPE_RECENT_EVENTS = EventOrMap[] | unknown[] | null;

const RelatedEvents = ({ incident, triggeringProblemId, latestSnapshot, triggeringEventId }: RelatedEventProps) => {
  // TODO: add back setChangesAreVisible
  const [changesAreVisible, setChangesAreVisible] = useState(true);

  // recent events
  // @ts-expect-error no typedef for incident or events
  const allRecentEvents = incident
    .get('recentEvents', emptyList)
    .sort(
      (a: Map<string, Object>, b: Map<string, Object>) =>
        incident.getIn(['issueOrderMap', a], Number.MAX_SAFE_INTEGER) -
        incident.getIn(['issueOrderMap', b], Number.MAX_SAFE_INTEGER)
    )
    .filter((_eid: string) => _eid !== triggeringEventId)
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
  const paginatedRecentEventsRaw: TYPE_RECENT_EVENTS =
    useObservable(combineLatest(paginatedRecentEventIds.map(getEvent)).throttle(250), [relatedEventsPage]) ?? null;

  const paginatedRecentEvents = paginatedRecentEventsRaw?.filter(event => {
    // @ts-expect-error no tyedef for event
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
                  // @ts-expect-error no type for recent events
                  key={_event.get('id')}
                  triggeringProblemId={triggeringProblemId}
                  event={_event}
                  latestSnapshot={latestSnapshot}
                  // @ts-expect-error no type for recent events
                  expandedFromTimeline={expandedEventOnClickInTimeline === _event.get('id')}
                  setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
                  // @ts-expect-error no type for recent events
                  highlightEventOnHover={highlightEventOnHover === _event.get('id')}
                />
              ))}
              {allRecentEvents.length !== 0 &&
                !paginatedRecentEvents &&
                Array(pageSize).map((_, idx) => <EventListItemSkeleton id={`${idx}`} />)}
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

interface ChangesButtonProps {
  recentEvents?: TYPE_RECENT_EVENTS;
  changesAreVisible?: boolean;
  setChangesAreVisible: (changesAreVisible: boolean) => void;
}

const ChangesButton = ({ recentEvents, changesAreVisible, setChangesAreVisible }: ChangesButtonProps) => {
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

const getNumberOfChanges = (recentEvents?: TYPE_RECENT_EVENTS) => {
  if (!recentEvents) {
    return 0;
  }
  // @ts-expect-error no ts for event when unknown
  return recentEvents.filter(event => getEventType(event) === EVENT_TYPES.CHANGE).length;
};

export default RelatedEvents;
