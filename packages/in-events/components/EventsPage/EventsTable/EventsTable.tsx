/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* eslint-disable react/no-unused-prop-types */

// eslint-disable-next-line no-restricted-imports
import { TableBatchAction } from '@carbon/react';
import React, { useState, useMemo } from 'react';
import { Close } from '@carbon/icons-react';
import { match } from 'react-router';
import { History } from 'history';
import { isNull } from 'lodash';

import { RawEvent, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import closeSelectedEvents from 'in-events/components/IncidentPage/RelatedEvents/utils/closeSelectedEvents';
import EventsDatagrid from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { multiCloseEnabled } from 'in-services/featureFlags';
import { Location } from 'in-stores/navigation/types';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

type SortingMapperOgKeys = 'problem.problemText' | 'start' | 'state' | 'end';

// END table configurations

type EVENT_KINDS = 'issue' | 'incident' | 'change' | 'agent_monitoring_issue' | 'prc_issue' | undefined;

const defaultSort = {
  orderBy: 'start',
  orderDirection: 'DESC'
};
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

const EventsTable: React.FC<EventsTableProps> = props => {
  const { eventType, items, filter, onChange, orderBy, orderDirection } = props;
  const [selectedRows, setRows] = useState({});

  const onFilterChange = (newFilters: string) => {
    onChange({
      filter: newFilters
    });
  };

  const selectedRowIds = useMemo(() => {
    return Object.keys(selectedRows).map(index => items[Number(index)]?.id);
  }, [selectedRows, items]);

  return (
    <div>
      <EventsDatagrid
        multiSelect={multiCloseEnabled}
        canMultiSelect={event => event.state === 'open'}
        multiSelectState={selectedRows}
        multiSelectUpdater={setRows}
        events={props.items as unknown as RawEvent[]}
        loading={props.progress.loading}
        loadMore={props.loadMore}
        canLoadMore={props.canLoadMore || false}
        showExpand={false}
        headers={['severity', 'problem.problemText', 'on', 'start', 'end', 'timeline', 'state']}
        height={'calc(100vh - 415px)'}
        multiSelectActions={
          <TableBatchAction
            renderIcon={Close}
            onClick={() => {
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
                closeSelectedEvents(eventType, selectedRowIds);
              }
            }}
          >
            {eventType === 'incident'
              ? t('in-events:multiClose.closeIncidents')
              : t('in-events:multiClose.closeIssues')}
          </TableBatchAction>
        }
        filtersEnabled
        onFilterChange={onFilterChange}
        currentFilters={filter}
        enableSorting
        sortableHeaders={['problem.problemText', 'start', 'end', 'state']}
        sortingState={{
          orderBy,
          orderDirection
        }}
        onSortChange={newValue => {
          if (isNull(newValue)) {
            onChange(defaultSort);
          } else {
            onChange(newValue);
          }
        }}
      />
    </div>
  );
};

export default EventsTable;
