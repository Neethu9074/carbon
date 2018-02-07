import React from 'react';

import LoadingTableRows from 'in-components/tables/ServerTable/internalComponents/LoadingTableRows';
import SearchField from 'in-components/tables/ServerTable/internalComponents/SearchField';
import Pagination from 'in-components/tables/ServerTable/internalComponents/Pagination';
import Columns from 'in-components/tables/ServerTable/internalComponents/Columns';
import Row from 'in-components/tables/ServerTable/internalComponents/Row';
import { pendingResult } from 'in-services/fixedObjects';

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

    // events
    onChange
  } = props;

  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;

  let body = null;
  if (isLoading) {
    body = <LoadingTableRows progress={result.progress} columnDefinitions={columnDefinitions} />;
  } else if (hasErrors) {
    body = (
      <tr>
        <td colSpan={columnDefinitions.length}>Errors</td>
      </tr>
    );
  } else if (result.data.totalHits === 0) {
    body = (
      <tr>
        <td colSpan={columnDefinitions.length}>No data found</td>
      </tr>
    );
  } else {
    body = result.data.items.map((item, i) => (
      <Row key={item.id || i} item={item} columnDefinitions={columnDefinitions} cellOpts={props} />
    ));
  }

  return (
    <div>
      <div className={locals.header}>
        <Pagination
          page={page}
          pageSize={pageSize}
          totalHits={!isLoading && !hasErrors ? result.data.totalHits : null}
          setPage={page => onChange({ query, orderBy, orderDirection, page, pageSize })}
        />
        <SearchField onChange={query => onChange({ query, orderBy, orderDirection, page, pageSize })} />
      </div>

      <table className={locals.table}>
        <thead>
          <Columns
            setOrder={(orderBy, orderDirection) => onChange({ query, orderBy, orderDirection, page, pageSize })}
            columnDefinitions={columnDefinitions}
            orderBy={orderBy}
            orderDirection={orderDirection}
          />
        </thead>

        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
