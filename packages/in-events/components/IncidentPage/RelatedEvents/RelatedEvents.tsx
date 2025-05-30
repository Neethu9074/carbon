/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment, useState } from 'react';
import classNames from 'classnames';

import {
  Button,
  CarbonLayer,
  Collapsible,
  Typography,
  Pagination as CarbonPagination,
  CarbonDataTable,
  CarbonTableContainer,
  CarbonTable,
  CarbonTableHead,
  CarbonTableRow,
  CarbonTableExpandHeader,
  CarbonTableHeader,
  CarbonTableBody,
  CarbonTableExpandRow,
  CarbonTableCell,
  CarbonTableExpandedRow,
  Link
} from '@instana/components';
import { formatDate, formatTime } from '@instana/format-date';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Snapshot } from '@instana/types';

// @ts-expect-error no typedef available
import { EVENT_TYPES, getEvent, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
// @ts-expect-error no typedef available
import { getEventViewWithTimeFocusedAt } from 'in-events/components/legacy/EventListItem';
// @ts-expect-error no typedef available
import EventDurationMarker from 'in-events/components/legacy/marker/EventDurationMarker';
// @ts-expect-error no typedef available
import { CombinedEventListItemContent } from 'in-events/components/legacy/EventListItem';
// @ts-expect-error no typedef available
import { EventListItemSkeleton } from 'in-events/components/legacy/EventListItem';
import { convertEventToRawEvent } from 'in-events/components/RootCauseAnalysis/Topology/utils/convertEventToRawEvent';
// @ts-expect-error no typedef available
import PopulationChart from 'in-events/components/legacy/PopulationChart';
// @ts-expect-error no typedef available
import EndedMarker from 'in-events/components/legacy/marker/EndedMarker';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { OnEntity } from 'in-events/components/EventsListRow';
import { useLocalStorage } from 'in-services/localStorage';
import { emptyList } from 'in-services/fixedImmutables';
import EventIcon from 'in-events/components/EventIcon';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface RelatedEventProps {
  incident: EventOrMap;
  triggeringProblemId?: string;
  latestSnapshot: Snapshot;
  triggeringEventId?: string;
}

type TYPE_RECENT_EVENTS = EventOrMap[] | unknown[] | null | undefined;

const RelatedEvents = ({ incident, triggeringProblemId, latestSnapshot, triggeringEventId }: RelatedEventProps) => {
  const [changesAreVisible, setChangesAreVisible] = useState(true);

  // recent events
  // @ts-expect-error no typedef for incident or events
  const recentEventIds = incident
    .get('recentEvents', emptyList)
    .sort(
      (a: Map<string, Object>, b: Map<string, Object>) =>
        incident.getIn(['issueOrderMap', a], Number.MAX_SAFE_INTEGER) -
        incident.getIn(['issueOrderMap', b], Number.MAX_SAFE_INTEGER)
    )
    .filter((_eid: string) => _eid !== triggeringEventId)
    .toArray();

  const totalRecentEvents = recentEventIds.length;

  // START related events pagination

  const [relatedEventsPage, setRelatedEventsPage] = useState(1);
  const [relatedEventsSection, setRelatedEventsSection] = useState(false);

  const [pageSize, setPageSize] = useLocalStorage('relatedEventsPageSize', 5);

  const paginatedRecentEventIds = recentEventIds?.slice(
    pageSize * (relatedEventsPage - 1),
    pageSize * relatedEventsPage
  );
  const paginatedRecentEventsRaw: TYPE_RECENT_EVENTS =
    useObservable(combineLatest(paginatedRecentEventIds.map(getEvent)).throttle(250), [pageSize, relatedEventsPage]) ??
    null;

  const paginatedRecentEvents = paginatedRecentEventsRaw?.filter(event => {
    // @ts-expect-error no tyedef for event
    if (!changesAreVisible && getEventType(event) === EVENT_TYPES.CHANGE) {
      return false;
    }
    return true;
  });

  const [expandedEventOnClickInTimeline, setExpandedEventOnClickInTimeline] = useState('');

  const [highlightEventOnHover, setHighlightEventOnHover] = useState('');

  // END related events pagination

  // getRawEvents to fetch the related events

  // end of getRawEventsQuery

  if (recentEventIds.length === 0) {
    return <RelatedEventsEmptyState />;
  }

  if (!paginatedRecentEvents && totalRecentEvents === 0) return <LoadingIndicator />;

  return (
    <div className={locals.layerBackground}>
      <CarbonLayer>
        <Collapsible initiallyOpen={relatedEventsSection} onOpen={() => setRelatedEventsSection(!relatedEventsSection)}>
          <Collapsible.Header>
            <Typography variant="body-regular">
              {t('in-events:titleRelatedEvents', {
                eventCount: totalRecentEvents
              })}
            </Typography>
          </Collapsible.Header>
          <Collapsible.Content>
            <LeftRightPadding>
              <div className={locals.accordionContent}>
                <ChangesButton
                  recentEvents={paginatedRecentEventsRaw}
                  changesAreVisible={changesAreVisible}
                  setChangesAreVisible={setChangesAreVisible}
                />
                <PopulationChart
                  incidentId={incident.get('id')}
                  recentEvents={paginatedRecentEvents}
                  changesAreVisible={changesAreVisible}
                  setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
                  setHighlightEventOnHover={setHighlightEventOnHover}
                />
                <div>
                  {recentEventIds.length !== 0 && !paginatedRecentEvents && <LoadingIndicator size="xl" />}
                  <RelatedEventsTable
                    relatedEvents={paginatedRecentEvents}
                    triggeringProblemId={triggeringProblemId}
                    latestSnapshot={latestSnapshot}
                    expandedEventOnClickInTimeline={expandedEventOnClickInTimeline}
                    setExpandedEventOnClickInTimeline={setExpandedEventOnClickInTimeline}
                    highlightEventOnHover={highlightEventOnHover}
                    incident={incident}
                  />
                  {recentEventIds.length !== 0 &&
                    !paginatedRecentEvents &&
                    Array(pageSize).map((_, idx) => <EventListItemSkeleton id={`${idx}`} />)}
                  {totalRecentEvents > pageSize && (
                    <CarbonPagination
                      currentPage={relatedEventsPage}
                      totalItems={totalRecentEvents}
                      pageSize={pageSize}
                      pageSizes={[5, 10, 15, 20]}
                      onChange={data => {
                        const { page: newPage, pageSize: newPageSize } = data;
                        setRelatedEventsPage(newPage);
                        setPageSize(newPageSize);
                      }}
                    />
                  )}
                </div>
              </div>
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

interface RelatedEventsTableProps {
  relatedEvents?: any;
  triggeringProblemId?: string;
  latestSnapshot: Snapshot;
  expandedEventOnClickInTimeline: string;
  setExpandedEventOnClickInTimeline: (newExpanded: string) => void;
  highlightEventOnHover: string;
  incident: EventOrMap;
}

const relatedEventsHeaders = [
  {
    key: 'type',
    header: ''
  },
  {
    key: 'name',
    header: t('in-events:headerTitle'),
    width: '25%'
  },
  {
    key: 'on',
    header: t('in-events:headerOn'),
    width: '25%'
  },
  {
    key: 'start',
    header: t('in-events:headerStarted'),
    width: '15%'
  },
  {
    key: 'end',
    header: t('in-events:headerEnd'),
    width: '15%'
  },
  {
    key: 'duration',
    header: t('in-events:titleDuration'),
    width: '15%'
  }
];

const RelatedEventsTable = ({
  relatedEvents,
  expandedEventOnClickInTimeline,
  setExpandedEventOnClickInTimeline,
  highlightEventOnHover,
  latestSnapshot,
  incident
}: RelatedEventsTableProps) => {
  const timeConfig = useTimeConfig();
  const { createHref, location } = useNavigation();

  if (!relatedEvents || relatedEvents.length === 0) {
    return <></>;
  }

  // @ts-expect-error no typedef for events from observable
  const eventsInJs = relatedEvents?.map(ev => ({
    start: (
      <Tooltip content={t('in-events:incident.setTimeConfig')}>
        <Link
          href={createHref(
            getEventViewWithTimeFocusedAt(
              ev.get('start'),
              timeConfig.windowSize,
              location,
              incident.get('id'),
              incident.get('type')
            )
          )}
        >
          {`${formatDate(ev.get('start'))} ${formatTime(ev.get('start'))}`}
        </Link>
      </Tooltip>
    ),
    end: <EndedMarker event={ev} justText />,
    name: (
      <Tooltip content={t('in-events:relatedEvents.openEvent')}>
        <Link
          href={createHref(
            getEventViewWithTimeFocusedAt(
              ev.get('start'),
              timeConfig.windowSize,
              location,
              ev.get('id'),
              ev.get('type')
            )
          )}
        >
          {ev.getIn(['problem', 'problemText'])}
        </Link>
      </Tooltip>
    ),
    type: <EventIcon event={ev} tooltipLabel={getEventSeverityLabelWithEventType(ev, timeConfig)} size="xs" />,
    duration: <EventDurationMarker event={ev} justText />,
    id: ev.get('id'),
    on: <OnEntity rawEvent={convertEventToRawEvent(ev.toJS())} />
  }));

  return (
    <CarbonDataTable rows={eventsInJs} headers={relatedEventsHeaders}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getExpandedRowProps,
        getTableProps,
        getTableContainerProps,
        expandRow
      }) => (
        <CarbonTableContainer {...getTableContainerProps()}>
          <CarbonTable experimentalAutoAlign {...getTableProps()} aria-label="Related events">
            <CarbonTableHead>
              <CarbonTableRow>
                <CarbonTableExpandHeader aria-label="expand row" />
                {headers.map(header => (
                  <CarbonTableHeader
                    {...getHeaderProps({ header })}
                    style={{
                      // @ts-expect-error
                      width: header?.width || 'auto'
                    }}
                  >
                    {header.header}
                  </CarbonTableHeader>
                ))}
              </CarbonTableRow>
            </CarbonTableHead>
            <CarbonTableBody>
              {rows.map(row => (
                <Fragment key={row.id}>
                  <CarbonTableExpandRow
                    {...getRowProps({ row })}
                    id={`event-${row.id}`}
                    isExpanded={expandedEventOnClickInTimeline === row.id}
                    className={classNames({
                      [locals.hovered]: row.id === highlightEventOnHover
                    })}
                    onExpand={() => {
                      if (row.id === expandedEventOnClickInTimeline) {
                        setExpandedEventOnClickInTimeline('');
                      } else {
                        setExpandedEventOnClickInTimeline(row.id);
                      }
                      expandRow(row.id);
                    }}
                  >
                    {row.cells.map(cell => (
                      <CarbonTableCell key={cell.id}>{cell.value}</CarbonTableCell>
                    ))}
                  </CarbonTableExpandRow>
                  <CarbonTableExpandedRow colSpan={headers.length + 1} {...getExpandedRowProps({ row })}>
                    <CombinedEventListItemContent
                      // @ts-expect-error
                      event={relatedEvents.find(re => re.get('id') === row.id)}
                      latestSnapshot={latestSnapshot}
                    />
                  </CarbonTableExpandedRow>
                </Fragment>
              ))}
            </CarbonTableBody>
          </CarbonTable>
        </CarbonTableContainer>
      )}
    </CarbonDataTable>
  );
};

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
      style={{ alignSelf: 'flex-end' }}
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
