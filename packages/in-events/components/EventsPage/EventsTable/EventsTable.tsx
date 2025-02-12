/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* eslint-disable react/no-unused-prop-types */

import React, { useEffect, useCallback } from 'react';
import { get, isEmpty } from 'lodash';
import { match } from 'react-router';
import { History } from 'history';
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
import { RawEvent, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import closeSelectedEvents from 'in-events/components/IncidentPage/RelatedEvents/utils/closeSelectedEvents';
import eventsTableColumns from 'in-events/components/IncidentPage/RelatedEvents/configs/EventTableColumns';
import buildQueryString from 'in-events/components/IncidentPage/RelatedEvents/utils/buildQueryString';
import issueFilters from 'in-events/components/IncidentPage/RelatedEvents/configs/EventIssueFilters';
import { DatagridActions } from 'in-events/components/EventsPage/EventsTable/DatagridActions';
import parseQuery from 'in-events/components/util/dataGridEventsTableUtil';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { multiCloseEnabled } from 'in-services/featureFlags';
import { useLocalStorage } from 'in-services/localStorage';
import { eventsPath } from 'in-events/navigation/paths';
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

type SortingMapperKeys = 'title' | 'start' | 'state' | 'end';

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
    onItemClicked,
    orderBy,
    orderDirection,
    location,
    filter: currentFilters,
    onChange,
    progress
  } = props;
  const { loading } = progress;
  const { navigate } = useNavigation();

  const isIncidentOrEvent = eventType === 'incident' || eventType === 'issue';
  const shouldShowMultiClose = multiCloseEnabled && isIncidentOrEvent;
  const shouldShowFilters = isIncidentOrEvent;

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
        filters: shouldShowFilters && currentFilters ? [initialFilters] : [],
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
    toggleAllRowsSelected,
    setAllFilters
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
