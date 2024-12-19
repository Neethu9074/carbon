/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Disposable, on, Subject } from '@instana/observables';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  KubernetesTablePresenter,
  orderByConfigForK8s
} from 'in-custom-dashboards/widgets/Table/kubernetesTable/KubernetesTablePresenter';
import { TableFormConfiguration, TableWidgetProps } from 'in-custom-dashboards/widgets/Table/types';
import TableConfigInfo from 'in-custom-dashboards/widgets/Table/eventsTable/TableConfigInfo';
//@ts-expect-error TS migration
import EventsList from 'in-events/components/EventsList';
//@ts-expect-error TS migration
import getRawEvents from 'in-subscription/getRawEvents';
import { ShowcaseProps } from 'in-custom-dashboards/widgets/Table/eventsTable/ShowCase';
import { useModifiedTimeConfig } from 'in-events/hooks/useModifiedTimeConfig';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { dataSources } from 'in-custom-dashboards/widgets/Table/index';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { concatQueries, spreadTimeConfig } from 'in-events/utils';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useResizeObserver from 'in-hooks/useResizeObserver';
import { Cursor, Cursorific, TimeConfig } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { EventContext } from 'in-types';

import locals from './TablePresenter.mless';

interface TableOverviewBehaviourProps extends Partial<TableWidgetProps> {}

const orderByConfig = {
  title: 'problem.problemText',
  started: 'start',
  ended: 'end'
};

const loadMoreRowCount = 15;

export default function TableOverviewBehaviour(props: TableOverviewBehaviourProps) {
  const { isPreview } = props;
  const { ref, height } = useResizeObserver();
  const [rowsPerPage, setRowsPerPage] = useState(0);

  useEffect(() => {
    if (height && rowsPerPage === 0) {
      // 190 is calculated by adding the height of card header  + Th  + load more button + padding-bottom.
      setRowsPerPage(Math.floor((height - 190) / 49));
    }
    // eslint cannot statically analyze the following case
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // incase of preview load only 4 events initially
  if (!rowsPerPage || (rowsPerPage < 0 && isPreview)) {
    setRowsPerPage(4);
  }
  // Observable to update the timeConfig at regular intervals in live mode
  const { modifiedTimeConfig$, mouseMoveSignal$ } = useModifiedTimeConfig(isPreview);

  // because in preview mode we don't want the table to refresh automatically
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const timeConfig: TimeConfig = useObservable(modifiedTimeConfig$, []) ?? useTimeConfig();

  return (
    <div className={locals.tableContent} ref={ref as React.RefObject<HTMLDivElement>}>
      {rowsPerPage > 0 && (
        <TableConfig {...props} rowsPerPage={rowsPerPage} timeConfig={timeConfig} mouseMoveSignal$={mouseMoveSignal$} />
      )}
    </div>
  );
}

interface TableConfigProps extends TableOverviewBehaviourProps {
  rowsPerPage: number;
  timeConfig: TimeConfig;
  mouseMoveSignal$: Subject<unknown>;
}

function TableConfig(props: TableConfigProps) {
  const { config, rowsPerPage, timeConfig } = props;
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);

  const orderByColumn = config?.columns?.length ? getOrderByColumn(config) : 'start';

  const [sorting, setSorting] = useState(setListSorting(orderByColumn));

  useEffect(() => {
    setSorting(setListSorting(orderByColumn));
  }, [orderByColumn]);

  const tableProps = useCursorPagination(
    ({ cursor }) =>
      getRawEvents({
        timeConfig: timeConfig,
        query: concatQueries(config?.dynamicFocusQuery, undefined),
        pagination: {
          cursor,
          retrievalSize: isLoadMoreClicked ? loadMoreRowCount : rowsPerPage
        },
        order: {
          by: sorting.orderBy,
          direction: sorting.orderDirection
        },
        eventContext: getEventContext(config?.source)
      }),
    [sorting, config?.source, config?.dynamicFocusQuery, ...spreadTimeConfig(undefined, timeConfig)]
  );

  function loadMoreData() {
    setIsLoadMoreClicked(true);
    tableProps.loadMore();
  }

  if (config?.source === dataSources.KUBERNETES_EVENTS.type) {
    return (
      <KubernetesTablePresenter
        {...props}
        {...tableProps}
        {...sorting}
        timeConfig={timeConfig}
        headers={config?.columns}
        setSorting={setSorting}
        loadMoreData={loadMoreData}
        orderBy={sorting.orderBy}
        orderDirection={sorting.orderDirection}
      />
    );
  }
  return (
    <TablePresenter
      {...props}
      {...tableProps}
      {...sorting}
      timeConfig={timeConfig}
      headers={config?.columns}
      setSorting={setSorting}
      loadMoreData={loadMoreData}
    />
  );
}

export interface TablePresenterProps extends TableOverviewBehaviourProps {
  items: Cursorific<Cursor>[] | ShowcaseProps[];
  headers?: string[];
  timeConfig: TimeConfig;
  loadMoreShowcaseData?: VoidFunction;
  canLoadMore?: boolean;
  progress: { loading: boolean };
  loadMoreData?: VoidFunction;
  setSorting?: any;
  showCaseView?: boolean;
  mouseMoveSignal$?: Subject<unknown>;
}

export const TablePresenter = (props: TablePresenterProps) => {
  const tableRef: React.MutableRefObject<EventTarget | undefined> = useRef();
  const onMouseMoveSubscriptionRef: React.MutableRefObject<Disposable | undefined | null> = useRef();
  const {
    title,
    dragHandle,
    actions,
    loadMoreShowcaseData,
    loadMoreData,
    setSorting,
    showCaseView = false,
    config,
    mouseMoveSignal$,
    isInModal,
    topLevelFilterNote
  } = props;

  const { location, navigate } = useNavigation();
  const eventsPath = '/events';

  const setupSubscriptions = useCallback(() => {
    if (!tableRef.current) {
      return;
    }

    onMouseMoveSubscriptionRef.current = on(tableRef.current!, 'mousemove').subscribe(() =>
      mouseMoveSignal$?.emit(Date.now())
    );
  }, [mouseMoveSignal$]);

  useEffect(() => {
    setupSubscriptions();

    return function cleanUp() {
      disposeSubscriptions();
    };
  }, [setupSubscriptions]);

  useEffect(() => {
    disposeSubscriptions();
    setupSubscriptions();
  });

  function onItemClicked(eventId: string) {
    const eventsListLocation = { ...location, pathname: eventsPath };
    setOrDeleteMatrixKey(eventsListLocation, eventsPath, 'eventId', eventId);
    navigate(eventsListLocation);
  }

  function sortTable(item: { orderBy: string; orderDirection: 'ASC' | 'DESC' }) {
    setSorting({ orderBy: item.orderBy, orderDirection: item.orderDirection });
  }

  function disposeSubscriptions() {
    if (onMouseMoveSubscriptionRef.current) {
      onMouseMoveSubscriptionRef.current?.dispose();
      onMouseMoveSubscriptionRef.current = null;
    }
  }

  return (
    <>
      <div
        ref={table => (tableRef.current = table as EventTarget)}
        className={classNames({
          [locals.container]: true,
          [locals.heightAuto]: showCaseView
        })}
      >
        <EventsList
          {...props}
          onItemClicked={onItemClicked}
          loadMore={showCaseView ? loadMoreShowcaseData : loadMoreData}
          onChange={sortTable}
          title={!isInModal && <EventsTitle title={title} config={config} topLevelFilterNote={topLevelFilterNote} />}
          cardHeader={
            <>
              {dragHandle}
              {actions}
            </>
          }
          isCustomDashboard
        />
      </div>
    </>
  );
};

function getOrderByColumn(config: TableFormConfiguration) {
  const source = config.source;
  const columns = config.columns;

  if (!columns) {
    return 'start';
  }

  if (source === dataSources.KUBERNETES_EVENTS.type) {
    return columns?.includes('time') ? 'time' : columns[0];
  }

  if (columns.includes('started')) {
    return orderByConfig.started;
  }
  return columns[0];
}

function setListSorting(orderByColumn: string) {
  let orderBy;

  if (orderByColumn in orderByConfig) {
    orderBy = orderByConfig[orderByColumn as keyof typeof orderByConfig];
  } else if (orderByColumn in orderByConfigForK8s) {
    orderBy = orderByConfigForK8s[orderByColumn as keyof typeof orderByConfigForK8s];
  } else {
    orderBy = orderByConfig.started;
  }

  return {
    orderBy,
    orderDirection: 'DESC'
  };
}

export function EventsTitle({
  title,
  config,
  topLevelFilterNote
}: {
  title?: string;
  config?: TableFormConfiguration;
  topLevelFilterNote?: string;
}) {
  const dynamicFocusQuery = config?.dynamicFocusQuery;
  return (
    <Typography variant="heading-03">
      <span className={locals.title}>
        <span>{title || '–'}</span>{' '}
        <TableConfigInfo dynamicFocusQuery={dynamicFocusQuery} topLevelFilterNote={topLevelFilterNote} />
      </span>
    </Typography>
  );
}

function getEventContext(source: string | undefined): EventContext {
  switch (source) {
    case dataSources.KUBERNETES_EVENTS.type:
      return 'KUBERNETES_EVENTS';
    default:
      return 'EVENTS';
  }
}
