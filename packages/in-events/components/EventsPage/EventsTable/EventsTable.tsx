/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* eslint-disable react/no-unused-prop-types */

import React, { useMemo, useEffect, useRef } from 'react';
import { match } from 'react-router';
import { History } from 'history';
import { isEmpty } from 'lodash';
import { isEqual } from 'lodash';

import {
  Datagrid,
  useDatagrid,
  useFiltering,
  useInfiniteScroll,
  useOnRowClick,
  useSortableColumns,
  useSelectRows,
  useDisableSelectRows
} from '@instana/ibm-products';
import { DateFormatterInput, formatDateTime } from '@instana/format-date';
import { RawEvent, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';
import { Button } from '@instana/components';

import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import { DatagridActions } from 'in-events/components/EventsPage/EventsTable/DatagridActions';
import { OnEntity, getStateBadge, getEndValue } from 'in-events/components/EventsListRow';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import MultiCloseIssueConfigForm from 'in-events/components/MultiCloseIssueConfigForm';
import TimelineCell from 'in-events/components/EventsPage/EventsTable/TimelineCell';
import parseQuery from 'in-events/components/util/dataGridEventsTableUtil';
import FailedIncidentsList from 'in-events/components/FailedIncidentsList';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { multiCloseEnabled } from 'in-services/featureFlags';
import { useLocalStorage } from 'in-services/localStorage';
import EventIcon from 'in-events/components/EventIcon';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

// START table configurations
const eventsTableColumns = [
  {
    Header: '',
    accessor: 'severity',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      const timeConfig = useTimeConfig();
      return <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />;
    },
    width: 50,
    disableSortBy: true
  },
  {
    Header: t('in-events:dataGridEventTable.title'),
    accessor: 'title',
    width: 350
  },
  {
    Header: t('in-events:dataGridEventTable.on'),
    accessor: 'entityLabel',
    width: 250,
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      return <OnEntity rawEvent={event} />;
    },
    disableSortBy: true
  },
  {
    Header: t('in-events:dataGridEventTable.started'),
    accessor: 'start',
    Cell: ({ cell: { value } }: { cell: { value: DateFormatterInput } }) => formatDateTime(value),
    width: 250
  },
  {
    Header: t('in-events:dataGridEventTable.end'),
    accessor: 'end',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      const eventType = getEventType(event);
      const isChangeEvent = eventType === EVENT_TYPES.CHANGE;
      const end = event.manualCloseTimestamp || event.end || Date.now();
      const start = event.start;
      const headers = eventsTableColumns;
      const endValue = getEndValue(event, isChangeEvent, end, start, headers, false) || '-';
      return endValue;
    },
    width: 250
  },
  {
    Header: 'Timeline',
    accessor: 'Timeline',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      return <TimelineCell event={event} />;
    },
    disableSortBy: true
  },
  {
    Header: t('in-events:dataGridEventTable.state'),
    accessor: 'state',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      return getStateBadge(event);
    }
  },
  {
    Header: 'Event type',
    accessor: 'Event type',
    width: 20,
    filter: 'checkbox',
    disableSortBy: true
  }
];

const hiddenColumns = ['Event type'];

const issueFilters = [
  // for issue page specifically
  {
    filterLabel: t('in-events:dataGridEventTable.eventType'),
    filter: {
      type: 'checkbox',
      column: 'Event type',
      props: {
        FormGroup: {
          legendText: t('in-events:dataGridEventTable.eventType')
        },
        Checkbox: [
          {
            id: 'built-in',
            labelText: t('in-events:dataGridEventTable.builtIn'),
            value: 'Built-In Event'
          },
          {
            id: 'custom',
            labelText: t('in-events:dataGridEventTable.custom'),
            value: 'Custom Event'
          },
          {
            id: 'application smart alert',
            labelText: t('in-events:dataGridEventTable.appSA'),
            value: 'Application Smart Alert'
          },
          {
            id: 'website smart alert',
            labelText: t('in-events:dataGridEventTable.webSA'),
            value: 'Website Smart Alert'
          },
          {
            id: 'synthetics smart alert',
            labelText: t('in-events:dataGridEventTable.syntheticsSA'),
            value: 'Synthetics Smart Alert'
          },
          {
            id: 'infrastructure smart alert',
            labelText: t('in-events:dataGridEventTable.infraSA'),
            value: 'Infrastructure Smart Alert'
          },
          {
            id: 'mobile smart alert',
            labelText: t('in-events:dataGridEventTable.mobileSA'),
            value: 'Mobile Smart Alert'
          },
          {
            id: 'log smart alert',
            labelText: t('in-events:dataGridEventTable.logSA'),
            value: 'Log Smart Alert'
          },
          {
            id: 'SLO smart alert',
            labelText: t('in-events:dataGridEventTable.sloSa'),
            value: 'SLO Smart Alert'
          }
        ]
      }
    }
  }
];

const sections = [
  {
    categoryTitle: '',
    filters: issueFilters
  }
];

const sortingMapper = {
  title: 'problem.problemText',
  start: 'start',
  state: 'state',
  end: 'end'
};

type SortingMapperKeys = 'title' | 'start' | 'state' | 'end';

// END table configurations

// START table functions

/**
 * Function to build query string from list of queries
 * @param list list of queries
 * @param keyword keyword to be used in query
 * @returns {string} final query string
 */
const buildQueryString = (list: string[], keyword: string) => {
  let queryString = '';

  list.forEach((item, index) => {
    queryString += `${keyword}:"${item}"`;
    if (index < list.length - 1) {
      queryString += ' OR ';
    }
  });

  return queryString;
};

/**
 *
 * @param eventType type of event
 * @param selectedFlatRows ids of selected events
 * @param toggleAllRowsSelected function to set all rows selection
 */
const closeSelectedEvents = (
  eventType: EVENT_KINDS,
  selectedFlatRows: [],
  toggleAllRowsSelected: (toggle: boolean) => void
) => {
  addActiveDialog(
    <MultiCloseIssueConfigForm
      onSaveSuccess={() => {
        addMessage({
          type: 'success',
          timeout: 5000,
          title:
            eventType === 'incident'
              ? t('in-events:multiClose.incidentsCloseSuccessTitle')
              : t('in-events:multiClose.issuesCloseSuccessTitle'),
          content: (
            <div>
              <p>
                {selectedFlatRows.length > 1
                  ? eventType === 'incident'
                    ? t('in-events:multiClose.multipleIncidentsCloseSuccessMessage', {
                        count: selectedFlatRows.length
                      })
                    : t('in-events:multiClose.multipleIssuesCloseSuccessMessage', { count: selectedFlatRows.length })
                  : eventType === 'incident'
                  ? t('in-events:multiClose.singleCloseIncidentSuccessMessage')
                  : t('in-events:multiClose.singleCloseIssueSuccessMessage')}
              </p>
            </div>
          )
        });

        // manually change the state of closed ids

        toggleAllRowsSelected(false);
        setTimeout(() => {
          // TODO: reload function from prop is not working
          window.location.reload();
        }, 2000);
      }}
      // @ts-expect-error
      eventIds={selectedFlatRows.map(i => i.original.id)}
      eventType={eventType}
      onSaveError={failedEvents => {
        addMessage({
          type: 'danger',
          title:
            eventType === 'incident'
              ? t('in-events:multiClose.incidentsCloseUnsuccessTitle')
              : t('in-events:multiClose.issuesCloseUnsuccessTitle'),
          content: (
            <div>
              <p>
                {failedEvents.length > 1
                  ? eventType === 'incident'
                    ? t('in-events:multiClose.multipleIncidentsCloseMessageUnsuccessful', {
                        count: failedEvents.length
                      })
                    : t('in-events:multiClose.multipleIssuesCloseMessageUnsuccessful', { count: failedEvents.length })
                  : eventType === 'incident'
                  ? t('in-events:multiClose.singleIncidentCloseMessageUnsuccessful')
                  : t('in-events:multiClose.singleIssueCloseMessageUnsuccessful')}
              </p>
              <Button
                kind="tertiary"
                size="compact"
                onClick={() =>
                  addActiveDialog(
                    <FailedIncidentsList
                      failedEventIds={failedEvents}
                      eventType={eventType}
                      // @ts-expect-error
                      eventIds={selectedFlatRows.map(i => i.original.id)}
                    />
                  )
                }
              >
                {t('in-events:multiClose.viewUnsuccessfulEventsList')}
              </Button>
            </div>
          )
        });
      }}
    />
  );
};

type EVENT_KINDS = 'issue' | 'incident' | 'change' | 'agent_monitoring_issue' | 'prc_issue' | undefined;

// END table functions
interface EventsTableProps {
  adjustedWindowSize?: number;
  awaitingData?: boolean;
  canLoadMore?: boolean;
  cursor?: any;
  disableCard?: boolean;
  errors?: [];
  eventId?: string;
  eventObservable?: any;
  eventType: EVENT_KINDS;
  filter?: string;
  highlightedTimeframe?: any;
  history: History;
  isPresentingHighlightedTimeframe?: boolean;
  items: EventOrMap[];
  loadMore: () => void;
  location: Location;
  match: match;
  mouseMoveSignal$?: Observable<any>;
  onChange: (change: {}) => void;
  onItemClicked: (eventId: string) => void;
  orderBy?: string;
  orderDirection?: string;
  progress: {
    loading: boolean;
  };
  query: string;
  reload: () => void;
  reloadCount: number;
  resultPrecisionDetails: {
    resultPrecision: string;
  };
  staticTimeConfigToUseForTable?: any;
  time?: any;
  timeConfig: TimeConfig;
  totalHits?: number;
  totalRepresentedItemCount?: number;
  totalRetainedItemCount?: number;
}

type ColumnWidths = { [key: string]: number };

const EventsTable = (props: EventsTableProps) => {
  const {
    canLoadMore,
    eventType,
    items: rawEvents,
    loadMore,
    location,
    onItemClicked,
    orderBy,
    orderDirection,
    progress
  } = props;
  const { loading } = progress;

  const isIncidentOrEvent = eventType === 'incident' || eventType === 'issue';
  const shouldShowMultiClose = multiCloseEnabled && isIncidentOrEvent;
  const shouldShowFilters = isIncidentOrEvent;

  const originalWidths: ColumnWidths = {};

  eventsTableColumns.forEach(({ accessor, width }) => {
    originalWidths[accessor] = width || 150;
  });

  const [currentWidths, setCurrentWidths] = useLocalStorage('event-table-widths', originalWidths);

  // Ref to detect that all filters are cleared
  const clearFilters = useRef(false);

  const filterProps = {
    variation: 'panel',
    updateMethod: 'batch',
    primaryActionLabel: t('in-events:dataGridEventTable.apply'),
    secondaryActionLabel: t('in-events:dataGridEventTable.cancel'),
    closeIconDescription: t('in-events:dataGridEventTable.closeFilters'),
    shouldClickOutsideToClose: false,
    align: 'bottom',
    panelTitle: t('in-events:dataGridEventTable.filterTitle'),
    sections,
    panelIconDescription: t('in-events:dataGridEventTable.openFilters'),
    onClearFilters: () => (clearFilters.current = true)
  };

  // Conversion of url filters to filter state
  const { navigate } = useNavigation();

  const currentFilters = getMatrixParameter(location, eventsPath, 'filter');
  const parsedResult = useMemo(() => parseQuery(currentFilters), [currentFilters]);

  const initialFilters = useMemo(() => {
    return {
      id: t('in-events:dataGridEventTable.eventType'),
      type: 'checkbox',
      value: [
        {
          id: 'built-in',
          labelText: t('in-events:dataGridEventTable.builtIn'),
          value: 'Built-In Event',
          selected: !!parsedResult?.['Built-In Event']
        },
        {
          id: 'custom',
          labelText: t('in-events:dataGridEventTable.custom'),
          value: 'Custom Event',
          selected: !!parsedResult?.['Custom Event']
        },
        {
          id: 'application smart alert',
          labelText: t('in-events:dataGridEventTable.appSA'),
          value: 'Application Smart Alert',
          selected: !!parsedResult?.['Application Smart Alert']
        },
        {
          id: 'website smart alert',
          labelText: t('in-events:dataGridEventTable.webSA'),
          value: 'Website Smart Alert',
          selected: !!parsedResult?.['Website Smart Alert']
        },
        {
          id: 'synthetics smart alert',
          labelText: t('in-events:dataGridEventTable.syntheticsSA'),
          value: 'Synthetics Smart Alert',
          selected: !!parsedResult?.['Synthetics Smart Alert']
        },
        {
          id: 'infrastructure smart alert',
          labelText: t('in-events:dataGridEventTable.infraSA'),
          value: 'Infrastructure Smart Alert',
          selected: !!parsedResult?.['Infrastructure Smart Alert']
        },
        {
          id: 'mobile smart alert',
          labelText: t('in-events:dataGridEventTable.mobileSA'),
          value: 'Mobile Smart Alert',
          selected: !!parsedResult?.['Mobile Smart Alert']
        },
        {
          id: 'log smart alert',
          labelText: t('in-events:dataGridEventTable.logSA'),
          value: 'Log Smart Alert',
          selected: !!parsedResult?.['Log Smart Alert']
        },
        {
          id: 'SLO smart alert',
          labelText: t('in-events:dataGridEventTable.sloSa'),
          value: 'SLO Smart Alert',
          selected: !!parsedResult?.['SLO Smart Alert']
        }
      ]
    };
  }, [parsedResult]);

  const datagridState = useDatagrid(
    {
      columns: eventsTableColumns,
      hiddenColumns,
      data: rawEvents,
      multiLineWrapAll: false,
      onRowClick: (row: { original: RawEvent }) => {
        onItemClicked(row.original.id as string);
      },
      DatagridActions: shouldShowFilters ? DatagridActions : null,
      filterProps: shouldShowFilters ? filterProps : {},
      manualSortBy: true,
      // batch actions
      batchActions: shouldShowMultiClose,
      hideSelectAll: false,
      toolbarBatchActions: [
        {
          label:
            eventType === 'incident' ? t('in-events:multiClose.closeIncidents') : t('in-events:multiClose.closeIssues'),
          renderIcon: null,
          onClick: () => closeSelectedEvents(eventType, selectedFlatRows, toggleAllRowsSelected)
        }
      ],
      // @ts-expect-error
      shouldDisableSelectRow: row => row?.original?.state === 'manually_closed' || row?.original?.state === 'closed',
      endPlugins: [useDisableSelectRows],
      disableSelectAll: false,
      // end batch actions
      manualFilters: true,
      initialState: {
        columnResizing: {
          columnWidths: currentWidths
        },
        filters: currentFilters ? [initialFilters] : [],
        sortableColumn: {
          id: orderBy,
          order: orderDirection
        },
        hiddenColumns
      },
      isFetching: loading,
      // infinite scroll
      fetchMoreData: () => {
        if (canLoadMore) {
          loadMore();
        }
      },
      loadMoreThreshold: 30,
      // currently its set to a static height until you refresh.
      // TODO: change it to be more dynamic if requested
      virtualHeight: window.innerHeight - 550
      // end infinite scroll
    },
    useFiltering,
    useOnRowClick,
    useInfiniteScroll,
    useSortableColumns,
    shouldShowMultiClose && useSelectRows
  );

  const {
    state: {
      filters,
      sortBy,
      columnResizing: { columnWidths }
    },
    selectedFlatRows,
    toggleAllRowsSelected
  } = datagridState;

  // When user change widths for columns, change it in localStorage
  useEffect(() => {
    const newHeaderWidths = {
      ...currentWidths,
      ...columnWidths
    };

    if (!isEqual(currentWidths, newHeaderWidths)) {
      setCurrentWidths(newHeaderWidths);
    }
  }, [columnWidths, currentWidths, setCurrentWidths]);

  // When sorting is changed, change it in the url.
  useEffect(() => {
    if (isEmpty(sortBy)) {
      setOrDeleteMatrixKey(location, eventsPath, 'orderBy', null);
      setOrDeleteMatrixKey(location, eventsPath, 'orderDirection', null);
      navigate(location);
      return;
    }

    const { id, desc } = sortBy[0];
    setOrDeleteMatrixKey(location, eventsPath, 'orderBy', sortingMapper[id as SortingMapperKeys]);
    setOrDeleteMatrixKey(location, eventsPath, 'orderDirection', desc ? 'DESC' : 'ASC');
    navigate(location);
  }, [sortBy, location, navigate]);

  // When filters change, run a clear/update to match the url.
  useEffect(() => {
    const updateSelectedFilters = () => {
      const selectedConfigTypes =
        filters[0].value
          ?.filter((config: { selected: boolean; value: string }) => config.selected)
          ?.map((config: { selected: boolean; value: string }) => config.value) || [];

      //Convert all the selections into filters param
      let selectedQuery = '';
      if (selectedConfigTypes && selectedConfigTypes.length > 0) {
        selectedQuery += buildQueryString(selectedConfigTypes, 'event.configuration');
      }

      //Set the filters=... param in URL
      setOrDeleteMatrixKey(location, eventsPath, 'filter', selectedQuery);
      navigate(location);
    };

    const clearAllFilters = () => {
      if (clearFilters.current) {
        setOrDeleteMatrixKey(location, eventsPath, 'filter', null);
        navigate(location);
        return;
      }
    };
    if (clearFilters.current || filters.length == 0) {
      clearAllFilters();
      clearFilters.current = false;
      return;
    }
    updateSelectedFilters();
  }, [filters, clearFilters, location, navigate]);
  return <Datagrid datagridState={datagridState} />;
};

export default EventsTable;
