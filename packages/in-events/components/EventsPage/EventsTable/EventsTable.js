/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Datagrid, useDatagrid, useFiltering, useOnRowClick } from '@carbon/ibm-products';
import React, { useMemo, useEffect, useRef } from 'react';

import { formatDateTime } from '@instana/format-date';

import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import { DatagridActions } from 'in-events/components/EventsPage/EventsTable/DatagridActions';
import { OnEntity, getStateBadge, getEndValue } from 'in-events/components/EventsListRow';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import parseQuery from 'in-events/components/util/dataGridEventsTableUtil';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';
import EventIcon from 'in-events/components/EventIcon';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const eventsTableColumns = [
  {
    Header: '',
    accessor: 'severity',
    Cell: ({ cell }) => {
      const event = cell.row.original;
      const timeConfig = useTimeConfig();
      return <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />;
    },
    width: 50
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
    Cell: ({ cell }) => {
      const event = cell.row.original;
      return <OnEntity rawEvent={event} />;
    }
  },
  {
    Header: t('in-events:dataGridEventTable.started'),
    accessor: 'start',
    Cell: ({ cell: { value } }) => formatDateTime(value),
    width: 250
  },
  {
    Header: t('in-events:dataGridEventTable.end'),
    accessor: 'end',
    Cell: ({ cell }) => {
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
    Header: t('in-events:dataGridEventTable.state'),
    accessor: 'state',
    Cell: ({ cell }) => {
      const event = cell.row.original;
      return getStateBadge(event);
    }
  },
  {
    Header: 'Event type',
    accessor: 'Event type',
    width: 20,
    filter: 'checkbox'
  }
];

const hiddenColumns = ['Event type'];

const denseListColumns = [
  {
    Header: '',
    accessor: 'severity',
    Cell: ({ cell }) => {
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

const EventsTable = ({ onItemClicked, rawEvents, eventType, isDenseList }) => {
  function buildQueryString(list, keyword) {
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
    panelTitle: `Filter ${eventType}`,
    sections,
    panelIconDescription: t('in-events:dataGridEventTable.openFilters'),

    onClearFilters: () => (clearFilters.current = true)
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
      onRowClick: row => {
        onItemClicked(row.original.id);
      },
      batchActions: true,
      DatagridActions,
      filterProps,
      hideSelectAll: true,
      manualSortBy: true,
      manualFilters: true,
      initialState: {
        filters: currentFilters ? [initialFilters] : [],
        hiddenColumns
      }
    },
    useFiltering,
    useOnRowClick
  );

  const {
    state: { filters }
  } = datagridState;

  // When filters change, run a clear/update to match the url.
  useEffect(() => {
    const updateSelectedFilters = () => {
      const selectedConfigTypes =
        filters[0].value?.filter(config => config.selected)?.map(config => config.value) || [];

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
      if (clearFilters) {
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
