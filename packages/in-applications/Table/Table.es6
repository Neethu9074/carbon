import React from 'react';

import SearchField from 'in-applications/Table/components/SearchField';
import Pagination from 'in-applications/Table/components/Pagination';
import Columns from 'in-applications/Table/components/Columns';
import { pendingResult } from 'in-services/fixedObjects';
import Row from 'in-applications/Table/components/Row';
import Progress from 'in-components/Progress';

import locals from './Table.mless';

export default function Application20Table({
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
}) {
  const isLoading = result.progress.loading;
  const hasErrors = result.errors.length > 0;

  let body = null;
  if (isLoading) {
    body = (
      <tr>
        <td colSpan={columnDefinitions.length}>
          <Progress progress={result.progress} />
        </td>
      </tr>
    );
  } else if (hasErrors) {
    body = (
      <tr>
        <td colSpan={columnDefinitions.length}>Errors</td>
      </tr>
    );
  } else {
    body = result.data.items.map((item, i) => (
      <Row key={item.id || i} item={item} columnDefinitions={columnDefinitions} />
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
