import React, { Fragment } from 'react';
import invariant from 'invariant';

import {
  ErrorRows,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  Table,
  Tbody,
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
import Card from 'in-new-components/Card';

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
    filterColumnDefinitionsByResult = () => () => true,
    getRowProps,
    onRowClick,
    result = pendingResult,
    cardTitle,
    tableInCard,
    fixedLayout,
    scrollWrapperClassName,
    rightHeader,
    leftHeader,
    isSearchable = true,
    searchPlaceholder = '',
    searchMaxWidth,
    size = 'regular',
    noDataMessage,
    showPagination = true,
    renderFooter = () => null,
    withoutPadding = true,
    allRowsAreSelected = false,
    setSelectedStateForRows,

    // events
    onChange,
    onRowMouseEnter = () => {},
    onRowMouseLeave = () => {}
  } = props;

  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;
  let lastPage = null;
  const filteredColumnDefinitions = columnDefinitions.filter(filterColumnDefinitionsByResult(result));

  let body = null;
  if (isLoading) {
    body = (
      <Fragment>
        <HorizontalIndicatorRow cols={filteredColumnDefinitions.length} progress={result.progress} />
        <LoadingSkeletonRows cols={filteredColumnDefinitions.length} />
      </Fragment>
    );
  } else if (hasErrors) {
    body = <ErrorRows cols={filteredColumnDefinitions.length} errors={result.errors} size={size} />;
  } else if (result.data.items.length === 0) {
    body = (
      <tr size={size}>
        <td colSpan={filteredColumnDefinitions.length}>
          <NoDataAvailable text={noDataMessage} height={80} />
        </td>
      </tr>
    );
  } else {
    body = result.data.items.map((item, i) => (
      <Row
        key={item.id || i}
        item={item}
        size={size}
        columnDefinitions={filteredColumnDefinitions}
        cellOpts={props}
        onMouseEnter={onRowMouseEnter}
        onMouseLeave={onRowMouseLeave}
        getRowProps={getRowProps}
        onRowClick={onRowClick}
      />
    ));
    lastPage = Math.ceil(result.data.totalHits / result.data.pageSize);
  }

  let header = (
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
  );

  const tableElement = (
    <Table tableInCard={tableInCard || cardTitle != null} fixedLayout={fixedLayout}>
      <Thead>
        <Columns
          setOrder={(orderBy, orderDirection) => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
          columnDefinitions={filteredColumnDefinitions}
          orderBy={orderBy}
          orderDirection={orderDirection}
          allRowsAreSelected={allRowsAreSelected}
          setSelectedStateForRows={setSelectedStateForRows}
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

  let pagination = showPagination &&
    lastPage > 1 && (
      <Pagination
        current={page}
        last={lastPage}
        onChange={page => onChange({ query, orderBy, orderDirection, page, pageSize })}
        className={evaluateClassNames({
          [locals.pagination]: true,
          [locals.paginationInCard]: cardTitle != null
        })}
      />
    );

  if (cardTitle != null) {
    if (__DEV__) {
      invariant(
        leftHeader == null,
        'Specifying a left header is not compatible with presentation of a table as a card.'
      );
    }
    return (
      <Card title={cardTitle} header={header} withoutPadding={withoutPadding}>
        {content}
        {pagination}
        {renderFooter(props)}
      </Card>
    );
  }
  return (
    <Fragment>
      <div className={joinClassNames(locals.header, headerClassName)}>
        {leftHeader || <span>&nbsp;</span>}
        {header}
      </div>
      {content}
      <div className={locals.paginationWrapper}>{pagination}</div>
    </Fragment>
  );
}
