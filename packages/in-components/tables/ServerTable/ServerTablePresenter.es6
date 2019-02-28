import React, { Fragment } from 'react';
import invariant from 'invariant';

import {
  Table,
  Thead,
  Tbody,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows
} from 'in-components/tables/sharedComponents';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { pendingResult } from 'in-services/fixedObjects';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
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
    getRowProps,
    onRowClick,
    result = pendingResult,
    cardTitle,
    tableInCard,
    fixedLayout,
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
    tableClassName,
    tableStyle,

    // events
    onChange,
    onRowMouseEnter = () => {},
    onRowMouseLeave = () => {}
  } = props;

  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;
  let lastPage = null;

  let body = null;
  if (isLoading) {
    body = (
      <Fragment>
        <HorizontalIndicatorRow cols={columnDefinitions.length} progress={result.progress} />
        <LoadingSkeletonRows cols={columnDefinitions.length} />
      </Fragment>
    );
  } else if (hasErrors) {
    body = <ErrorRows cols={columnDefinitions.length} errors={result.errors} size={size} />;
  } else if (result.data.items.length === 0) {
    body = (
      <tr size={size}>
        <td colSpan={columnDefinitions.length}>
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
        columnDefinitions={columnDefinitions}
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
  let content = (
    <Table
      className={tableClassName}
      style={tableStyle}
      tableInCard={tableInCard || cardTitle != null}
      fixedLayout={fixedLayout}
    >
      <Thead>
        <Columns
          setOrder={(orderBy, orderDirection) => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
          columnDefinitions={columnDefinitions}
          orderBy={orderBy}
          orderDirection={orderDirection}
        />
      </Thead>

      <Tbody>{body}</Tbody>
    </Table>
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
