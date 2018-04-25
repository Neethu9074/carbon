import React, { Fragment } from 'react';
import invariant from 'invariant';

import {
  Table,
  Thead,
  Tbody,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  Tr,
  Td
} from 'in-components/tables/sharedComponents';
import SearchInput from 'in-components/tables/ServerTable/internalComponents/SearchInput';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import { evaluateClassNames } from 'in-services/util/classnames';
import { pendingResult } from 'in-services/fixedObjects';
import Pagination from 'in-new-components/Pagination';
import Card from 'in-new-components/Card';

import locals from './ServerTablePresenter.mless';

export default function ServerTablePresenter(props) {
  const {
    // values configurable via the table
    query,
    page,
    orderBy,
    orderDirection,
    pageSize,

    // values that define the content
    columnDefinitions,
    result = pendingResult,
    cardTitle,
    tableInCard,
    rightHeader,
    leftHeader,
    isSearchable = true,

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
    body = <ErrorRows cols={columnDefinitions.length} errors={result.errors} />;
  } else if (result.data.totalHits === 0) {
    body = (
      <Tr>
        <Td colSpan={columnDefinitions.length}>No data found</Td>
      </Tr>
    );
  } else {
    body = result.data.items.map((item, i) => (
      <Row
        key={item.id || i}
        item={item}
        columnDefinitions={columnDefinitions}
        cellOpts={props}
        onMouseEnter={onRowMouseEnter}
        onMouseLeave={onRowMouseLeave}
      />
    ));
    lastPage = Math.ceil(result.data.totalHits / result.data.pageSize);
  }

  let header = (
    <div className={locals.rightHeader}>
      {rightHeader}
      {isSearchable && (
        <SearchInput
          query={query}
          onChange={query => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
        />
      )}
    </div>
  );
  let content = (
    <Table tableInCard={tableInCard || cardTitle != null}>
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
  let pagination = lastPage > 1 && (
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
      <Card title={cardTitle} header={header} withoutPadding>
        {content}
        {pagination}
      </Card>
    );
  }
  return (
    <Fragment>
      <div className={locals.header}>
        {leftHeader || <span>&nbsp;</span>}
        {header}
      </div>
      {content}
      <div className={locals.paginationWrapper}>{pagination}</div>
    </Fragment>
  );
}
