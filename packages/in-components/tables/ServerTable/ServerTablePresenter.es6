import React, { Fragment } from 'react';
import invariant from 'invariant';

import LoadingTableRows from 'in-components/tables/ServerTable/internalComponents/LoadingTableRows';
import SearchInput from 'in-components/tables/ServerTable/internalComponents/SearchInput';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
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
    rightHeader,
    leftHeader,

    // events
    onChange
  } = props;

  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;
  let lastPage = null;

  let body = null;
  if (isLoading) {
    body = <LoadingTableRows progress={result.progress} columnDefinitions={columnDefinitions} />;
  } else if (hasErrors) {
    body = (
      <tr>
        <td colSpan={columnDefinitions.length} className={locals.error}>
          <ErroneousResultPresenter errors={result.errors} />
        </td>
      </tr>
    );
  } else if (result.data.totalHits === 0) {
    body = (
      <tr>
        <td colSpan={columnDefinitions.length} className={locals.noData}>
          No data found
        </td>
      </tr>
    );
  } else {
    body = result.data.items.map((item, i) => (
      <Row key={item.id || i} item={item} columnDefinitions={columnDefinitions} cellOpts={props} />
    ));
    lastPage = Math.ceil(result.data.totalHits / result.data.pageSize);
  }

  let header = (
    <div className={locals.rightHeader}>
      {rightHeader}
      <SearchInput query={query} onChange={query => onChange({ query, orderBy, orderDirection, page: 1, pageSize })} />
    </div>
  );
  let content = (
    <table
      className={evaluateClassNames({
        [locals.table]: true,
        [locals.tableAsCard]: cardTitle != null
      })}
      cellSpacing="0"
    >
      <thead>
        <Columns
          setOrder={(orderBy, orderDirection) => onChange({ query, orderBy, orderDirection, page: 1, pageSize })}
          columnDefinitions={columnDefinitions}
          orderBy={orderBy}
          orderDirection={orderDirection}
        />
      </thead>

      <tbody>{body}</tbody>
    </table>
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
