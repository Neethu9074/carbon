import React from 'react';

import locals from './Pagination.mless';

export default function Pagination({ ariaLabel, currentPage, pageCount, onNextPage, onPrevPage }) {
  const prevDisabled = currentPage === 0;
  const prev = prevDisabled
    ? preventDefault
    : e => {
        e.preventDefault();
        onPrevPage();
      };

  const nextDisabled = currentPage >= pageCount - 1;
  const next = nextDisabled
    ? preventDefault
    : e => {
        e.preventDefault();
        onNextPage();
      };

  return (
    <nav aria-label={ariaLabel} className={locals.pagination}>
      <a href="" aria-label="Previous" onClick={prev} className={prevDisabled ? locals.disabledAction : locals.action}>
        Prev
      </a>
      <div className={locals.center}>{`${currentPage + 1} / ${pageCount}`}</div>
      <a href="" aria-label="Next" onClick={next} className={nextDisabled ? locals.disabledAction : locals.action}>
        Next
      </a>
    </nav>
  );
}

function preventDefault(e) {
  e.preventDefault();
}
