import React, { Fragment } from 'react';

import {
  ErrorRows,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  Table,
  Tbody,
  Tr,
  Td,
  Thead
} from 'in-components/tables/sharedComponents';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { pendingResult } from 'in-services/fixedObjects';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
import ScrollHints from 'in-components/ScrollHints';

import locals from './ServerTablePresenter.mless';

export default function ServerTablePresenter(props) {
  const {
    // custom classnames
    headerClassName,

    // values configurable via the table
    query,
    page,
    orderBy,
    orderDirection,
    pageSize,

    // values that define the content
    columnDefinitions,
    optionalColumns,
    disabledColumns = [],
    filterColumnDefinitions = () => () => true,
    getRowProps,
    onRowClick,
    result = pendingResult,
    fixedLayout,
    scrollWrapperClassName,
    rightHeader,
    leftHeader,
    isSearchable = true,
    searchPlaceholder = '',
    searchMaxWidth,
    size = 'regular',
    noDataMessage,
    allRowsAreSelected = false,
    setSelectedStateForRows,
    renderNoDataAvailable,

    // events
    onChange,
    onRowMouseEnter = () => {},
    onRowMouseLeave = () => {}
  } = props;
  const filteredColumnDefinitions = columnDefinitions.filter(filterColumnDefinitions(props));

  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;

  let filteredAndDisabledColumnDefinitions = filteredColumnDefinitions;
  const containsOptionalColumns = optionalColumns && optionalColumns.length > 0;
  if (containsOptionalColumns) {
    filteredAndDisabledColumnDefinitions = filteredColumnDefinitions.filter(
      def => disabledColumns.indexOf(def.id) === -1
    );
  }

  let body = null;
  if (isLoading) {
    body = getLoadingContent(filteredAndDisabledColumnDefinitions, result);
  } else if (hasErrors) {
    body = <ErrorRows cols={filteredAndDisabledColumnDefinitions.length} errors={result.errors} size={size} />;
  } else if (result.data.items.length === 0) {
    body = getEmptyContent(filteredAndDisabledColumnDefinitions, size, renderNoDataAvailable, noDataMessage);
  } else {
    body = result.data.items.map((item, i) => (
      <Row
        key={item.id || i}
        item={item}
        size={size}
        columnDefinitions={filteredAndDisabledColumnDefinitions}
        cellOpts={props}
        onMouseEnter={onRowMouseEnter}
        onMouseLeave={onRowMouseLeave}
        getRowProps={getRowProps}
        onRowClick={onRowClick}
      />
    ));
  }

  const tableElement = (
    <Table fixedLayout={fixedLayout}>
      <Thead>
        <Columns
          setOrder={(orderBy, orderDirection) => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
          columnDefinitions={filteredAndDisabledColumnDefinitions}
          orderBy={orderBy}
          orderDirection={orderDirection}
          allRowsAreSelected={allRowsAreSelected}
          setSelectedStateForRows={setSelectedStateForRows}
          optionalColumns={optionalColumns}
          availableColumnDefinitions={filteredColumnDefinitions}
          onColumnChecked={(id, c) => onColumnChecked(onChange, disabledColumns, id, c)}
        />
      </Thead>
      <Tbody>{body}</Tbody>
    </Table>
  );
  let content = scrollWrapperClassName ? (
    <ScrollHints
      className={scrollWrapperClassName}
      contentChangeMarker={
        /*
          * Triggers a re-render when the number of rows change (which is necessary because the height of the content
          * will change).
          */
        result.data && result.data.items ? result.data.items.length : 0
      }
    >
      {tableElement}
    </ScrollHints>
  ) : (
    tableElement
  );

  return (
    <Fragment>
      <div className={joinClassNames(locals.header, headerClassName)}>
        {leftHeader || <span>&nbsp;</span>}
        <div className={locals.rightHeader}>
          {typeof rightHeader === 'function' ? rightHeader(props) : rightHeader}
          {isSearchable && (
            <SearchInput
              maxWidth={searchMaxWidth ? searchMaxWidth : 140}
              query={query}
              placeholder={searchPlaceholder}
              onChange={query => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
            />
          )}
        </div>
      </div>

      {content}

      {result.data &&
        result.data.totalHits > result.data.pageSize && (
          <div className={locals.paginationWrapper}>
            <Pagination
              current={page}
              last={Math.ceil(result.data.totalHits / result.data.pageSize)}
              onChange={page => onChange({ query, orderBy, orderDirection, page, pageSize })}
              className={evaluateClassNames({
                [locals.pagination]: true
              })}
            />
          </div>
        )}
    </Fragment>
  );
}

function onColumnChecked(onChange, disabledColumns, columnId, checked) {
  onChange({
    disabledColumns: checked
      ? disabledColumns.filter(_columnId => _columnId !== columnId)
      : [...disabledColumns, columnId]
  });
}

function getLoadingContent(filteredAndDisabledColumnDefinitions, result) {
  return (
    <Fragment>
      <HorizontalIndicatorRow cols={filteredAndDisabledColumnDefinitions.length} progress={result.progress} />
      <LoadingSkeletonRows cols={filteredAndDisabledColumnDefinitions.length} />
    </Fragment>
  );
}

function getEmptyContent(filteredAndDisabledColumnDefinitions, size, renderNoDataAvailable, noDataMessage) {
  return (
    <Tr size={size}>
      <Td colSpan={filteredAndDisabledColumnDefinitions.length}>
        {renderNoDataAvailable ? (
          renderNoDataAvailable(noDataMessage)
        ) : (
          <NoDataAvailable text={noDataMessage} height={80} />
        )}
      </Td>
    </Tr>
  );
}
