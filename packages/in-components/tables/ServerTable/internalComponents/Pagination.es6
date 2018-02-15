import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Pagination.mless';

export default function Pagination({ setPage, totalHits, page, pageSize }) {
  if (!totalHits || totalHits < 0) {
    return null;
  }

  const totalPages = Math.ceil(totalHits / pageSize);

  return (
    <div className={locals.pagination}>
      {page > 1 ? (
        <SvgIcon
          className={locals.icon}
          type="triangle_left"
          height={9}
          color="#16363E"
          onClick={() => setPage(page - 1)}
        />
      ) : null}
      {`${page}/${totalPages}`}
      {page < totalPages ? (
        <SvgIcon
          className={locals.icon}
          type="triangle_right"
          height={9}
          color="#16363E"
          onClick={() => setPage(page + 1)}
        />
      ) : null}
    </div>
  );
}
