/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';

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
import { Button } from '@instana/components';
import { RawEvent } from '@instana/types';

import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import { DatagridActions } from 'in-events/components/EventsPage/EventsTable/DatagridActions';
import { OnEntity, getStateBadge, getEndValue } from 'in-events/components/EventsListRow';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import MultiCloseIssueConfigForm from 'in-events/components/MultiCloseIssueConfigForm';
import parseQuery from 'in-events/components/util/dataGridEventsTableUtil';
import FailedIncidentsList from 'in-events/components/FailedIncidentsList';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import { multiCloseEnabled } from 'in-services/featureFlags';
import EventIcon from 'in-events/components/EventIcon';
import useTimeConfig from 'in-hooks/useTimeConfig';
import TimelineCell from './TimelineCell';
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

const denseListColumns = [
  {
    Header: '',
    accessor: 'severity',
    Cell: ({ cell }: { cell: { row: { original: RawEvent } } }) => {
      const event = cell.row.original;
      const timeConfig = useTimeConfig();
      return <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />;
    },
    width: 50,
    filter: 'checkbox'
  },
  {
    Header: t('in-events:dataGridEventTable.title'),
    accessor: 'title',
    width: 350
  }
];

const filters = [
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
    filters
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
interface EventsTableProps {
  onItemClicked: (eventID: string) => void;
  rawEvents: RawEvent[];
  isDenseList: boolean;
  orderBy: string;
  orderDirection: string;
  loading: boolean;
  canLoadMore: boolean;
  loadMore: () => void;
  eventType?: string;
}

const EventsTable = ({
  onItemClicked,
  rawEvents,
  isDenseList,
  orderBy,
  orderDirection,
  loading,
  canLoadMore,
  loadMore,
  eventType
}: EventsTableProps) => {
  function buildQueryString(list: string[], keyword: string) {
    let queryString = '';

    list.forEach((item, index) => {
      queryString += `${keyword}:"${item}"`;
      if (index < list.length - 1) {
        queryString += ' OR ';
      }
    });

    return queryString;
  }

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

  // function to close selected events
  const closeSelectedEvents = () => {
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

  // Conversion of url filters to filter state
  const { location, navigate } = useNavigation();

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
      columns: isDenseList ? denseListColumns : eventsTableColumns,
      hiddenColumns,
      data: rawEvents,
      multiLineWrapAll: false,
      onRowClick: (row: { original: RawEvent }) => {
        onItemClicked(row.original.id as string);
      },
      DatagridActions,
      filterProps,
      manualSortBy: true,
      // batch actions
      batchActions: multiCloseEnabled,
      hideSelectAll: false,
      toolbarBatchActions: [
        {
          label:
            eventType === 'incident' ? t('in-events:multiClose.closeIncidents') : t('in-events:multiClose.closeIssues'),
          renderIcon: null,
          onClick: () => closeSelectedEvents()
        }
      ],
      // @ts-expect-error
      shouldDisableSelectRow: row => row?.original?.state === 'manually_closed' || row?.original?.state === 'closed',
      endPlugins: [useDisableSelectRows],
      disableSelectAll: false,
      // end batch actions
      manualFilters: true,
      initialState: {
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
    multiCloseEnabled && useSelectRows
  );

  const {
    state: { filters, sortBy },
    selectedFlatRows,
    toggleAllRowsSelected
  } = datagridState;

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
