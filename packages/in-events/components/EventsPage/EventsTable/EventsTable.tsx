/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* eslint-disable react/no-unused-prop-types */

import React, { useEffect, useCallback, useState } from 'react';
import { get, isEmpty } from 'lodash';
import { match } from 'react-router';
import { History } from 'history';
import { isEqual } from 'lodash';

import {
  Datagrid,
  useDatagrid,
  useFiltering,
  useInfiniteScroll,
  useSortableColumns,
  useSelectRows,
  useDisableSelectRows
} from '@instana/ibm-products';
import { RawEvent, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import closeSelectedEvents from 'in-events/components/IncidentPage/RelatedEvents/utils/closeSelectedEvents';
import eventsTableColumns from 'in-events/components/IncidentPage/RelatedEvents/configs/EventTableColumns';
import buildQueryString from 'in-events/components/IncidentPage/RelatedEvents/utils/buildQueryString';
import issueFilters from 'in-events/components/IncidentPage/RelatedEvents/configs/EventIssueFilters';
import { DatagridActions } from 'in-events/components/EventsPage/EventsTable/DatagridActions';
import parseQuery from 'in-events/components/util/dataGridEventsTableUtil';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { multiCloseEnabled } from 'in-services/featureFlags';
import { useLocalStorage } from 'in-services/localStorage';
import { Location } from 'in-stores/navigation/types';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

const hiddenColumns = ['Event type'];

// START table configurations

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

const sortingMapperReverse = {
  'problem.problemText': 'title',
  start: 'start',
  state: 'state',
  end: 'end'
};

type SortingMapperKeys = 'title' | 'start' | 'state' | 'end';
type SortingMapperOgKeys = 'problem.problemText' | 'start' | 'state' | 'end';

// END table configurations

type EVENT_KINDS = 'issue' | 'incident' | 'change' | 'agent_monitoring_issue' | 'prc_issue' | undefined;

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
  orderBy?: SortingMapperOgKeys;
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
    onItemClicked,
    orderBy = 'start',
    orderDirection,
    filter: currentFilters,
    onChange,
    progress
  } = props;
  const { loading } = progress;

  const isIncidentOrEvent = eventType === 'incident' || eventType === 'issue';
  const shouldShowMultiClose = multiCloseEnabled && isIncidentOrEvent;
  const shouldShowFilters = isIncidentOrEvent;
  // This is done to have a source of truth so the events is selected even after new data is fetched
  const [selectedRows, setSelectedRows] = useState({});

  const originalWidths: ColumnWidths = {};

  eventsTableColumns.forEach(({ accessor, width }) => {
    originalWidths[accessor] = width || 150;
  });

  const [currentWidths, setCurrentWidths] = useLocalStorage('event-table-widths', originalWidths);

  // Clearing all filters
  const onClearFilters = useCallback(() => {
    onChange({
      filter: ''
    });
    setAllFilters([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);

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
    onClearFilters: () => {
      onClearFilters();
    }
  };

  // Conversion of url filters to filter state

  const parsedResult = shouldShowFilters ? parseQuery(currentFilters) : {};
  const firstFilter = issueFilters[0];

  const initialFilters = shouldShowFilters
    ? {
        id: firstFilter.filterLabel,
        type: firstFilter.filter.type,
        value: firstFilter.filter.props.Checkbox.map(v => ({
          id: v.id,
          labelText: v.labelText,
          value: v?.value,
          selected: get(parsedResult, v?.value, false)
        }))
      }
    : {};

  const datagridState = useDatagrid(
    {
      columns: eventsTableColumns,
      hiddenColumns,
      data: rawEvents,
      multiLineWrapAll: false,
      getRowId: (row: RawEvent) => row.id,
      DatagridActions: shouldShowFilters ? DatagridActions : null,
      filterProps: shouldShowFilters ? filterProps : {},
      manualSortBy: true,
      // batch actions
      batchActions: shouldShowMultiClose,
      hideSelectAll: false,
      onRowSelect: (row: RawEvent, event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSelectedRows({
          ...selectedRows,
          [row.id as string]: isChecked
        });
      },
      toolbarBatchActions: [
        {
          label:
            eventType === 'incident' ? t('in-events:multiClose.closeIncidents') : t('in-events:multiClose.closeIssues'),
          renderIcon: null,
          onClick: () => {
            if (Object.keys(selectedRows).length > 100) {
              addMessage({
                title:
                  eventType === 'incident'
                    ? t('in-events:multiClose.multiCloseIncidentsLimitReached')
                    : t('in-events:multiClose.multiCloseIssuesLimitReached'),
                type: 'danger',
                content:
                  eventType === 'incident'
                    ? t('in-events:multiClose.multiCloseIncidentsLimitReachedDescription')
                    : t('in-events:multiClose.multiCloseIssuesLimitReachedDescription')
              });
            } else {
              closeSelectedEvents(eventType, Object.keys(selectedRows), toggleAllRowsSelected);
            }
          }
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
        filters: shouldShowFilters && currentFilters ? [initialFilters] : [],
        sortableColumn: {
          id: sortingMapperReverse[orderBy],
          order: orderDirection
        },
        hiddenColumns,
        selectedRowIds: selectedRows,
        onItemClicked
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
    useInfiniteScroll,
    useSortableColumns,
    shouldShowMultiClose && useSelectRows
  );

  const {
    state: {
      filters,
      sortBy,
      columnResizing: { columnWidths },
      selectedRowIds
    },
    toggleAllRowsSelected,
    setAllFilters
  } = datagridState;

  useEffect(() => {
    if (!isEqual(selectedRows, selectedRowIds)) {
      setSelectedRows(selectedRowIds);
    }
  }, [selectedRowIds, selectedRows]);
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
      onChange({
        orderBy: 'start',
        orderDirection: 'DESC'
      });
      return;
    }

    const { id, desc } = sortBy[0];
    onChange({
      orderBy: sortingMapper[id as SortingMapperKeys],
      orderDirection: desc ? 'DESC' : 'ASC'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // When filters change, run a clear/update to match the url.
  useEffect(() => {
    // Update filters based on current selected filters in the URL
    const updateSelectedFilters = () => {
      if (isEmpty(filters)) {
        return;
      }

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
      onChange({
        filter: selectedQuery
      });
      return;
    };
    if (isEmpty(filters) && !isEmpty(currentFilters)) {
      onClearFilters();
    } else {
      updateSelectedFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (!shouldShowFilters) {
      setAllFilters([]);
    }
  }, [shouldShowFilters, setAllFilters]);

  return <Datagrid datagridState={datagridState} />;
};

export default EventsTable;
