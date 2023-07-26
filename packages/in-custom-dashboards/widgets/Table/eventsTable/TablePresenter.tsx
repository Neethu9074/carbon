/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

//@ts-expect-error TS migration
import { concatQueries, spreadTimeConfig } from 'in-events/EventView';
import TableConfigInfo from 'in-custom-dashboards/widgets/Table/eventsTable/TableConfigInfo';
//@ts-expect-error TS migration
import EventsList from 'in-events/components/EventsList';
//@ts-expect-error TS migration
import getRawEvents from 'in-subscription/getRawEvents';
import { ShowcaseProps } from 'in-custom-dashboards/widgets/Table/eventsTable/ShowCase';
import { TableWidgetProps } from 'in-custom-dashboards/widgets/Table/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useResizeObserver from 'in-hooks/useResizeObserver';
import { Cursor, Cursorific, TimeConfig } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';

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
      // 175 is calculated by adding the card header height + Th height + load more button height.
      setRowsPerPage(Math.floor((height - 175) / 49));
    }
    // eslint cannot statically analyze the following case
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  //incase of preview load only 4 events initially
  if (!rowsPerPage && isPreview) {
    setRowsPerPage(4);
  }

  return (
    <div className={locals.tableContent} ref={ref as React.RefObject<HTMLDivElement>}>
      {rowsPerPage > 0 && <TableConfig {...props} rowsPerPage={rowsPerPage} />}
    </div>
  );
}

interface TableConfigProps extends TableOverviewBehaviourProps {
  rowsPerPage: number;
}

function TableConfig(props: TableConfigProps) {
  const timeConfig = useTimeConfig();
  const { config, rowsPerPage } = props;
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);
  const orderByColumn = config?.columns?.length ? config?.columns[0] : orderByConfig.started;

  const [sorting, setSorting] = useState({
    orderBy: orderByConfig[orderByColumn as keyof typeof orderByConfig],
    orderDirection: 'ASC'
  });

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
        }
      }),
    [sorting, config?.dynamicFocusQuery, ...spreadTimeConfig(undefined, timeConfig)]
  );

  function loadMoreData() {
    setIsLoadMoreClicked(true);
    tableProps.loadMore();
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
}

export const TablePresenter = (props: TablePresenterProps) => {
  const {
    title,
    isPreview,
    dragHandle,
    actions,
    loadMoreShowcaseData,
    loadMoreData,
    setSorting,
    showCaseView = false,
    config
  } = props;

  const { location, navigate } = useNavigation();
  const eventsPath = '/events';
  const dynamicFocusQuery = config?.dynamicFocusQuery;

  // function to navigate to events list page
  function onItemClicked(eventId: string) {
    const eventsListLocation = { ...location, pathname: eventsPath };
    setOrDeleteMatrixKey(eventsListLocation, eventsPath, 'eventId', eventId);
    navigate(eventsListLocation);
  }

  function sortTable(item: { orderBy: string; orderDirection: 'ASC' | 'DESC' }) {
    setSorting({ orderBy: item.orderBy, orderDirection: item.orderDirection });
  }

  return (
    <>
      <div
        className={classNames({
          [locals.container]: true,
          [locals.heightAuto]: isPreview
        })}
      >
        <EventsList
          {...props}
          onItemClicked={onItemClicked}
          loadMore={showCaseView ? loadMoreShowcaseData : loadMoreData}
          onChange={sortTable}
          title={title}
          cardHeader={
            <>
              {dragHandle}
              {actions}
            </>
          }
          {...(dynamicFocusQuery && {
            leftHeaderContent: <TableConfigInfo dynamicFocusQuery={dynamicFocusQuery} />
          })}
          isCustomDashboard
        />
      </div>
    </>
  );
};
