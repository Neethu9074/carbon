import classNames from 'classnames';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Pagination.mless';

const pagePlaceholder = undefined;

export default function Pagination({ currentPage, numPages, onChange }) {
  if (numPages <= 1) {
    return null;
  }

  const pages = getSteps(currentPage, numPages);
  return (
    <div className={locals.pagination}>
      <Control disabled={currentPage <= 1} onChange={() => onChange(currentPage - 1)}>
        <SvgIcon className={locals.icon} type="lib_arrow_expand_left" />
      </Control>

      {pages.map((page, i) => (
        <Control
          key={i}
          isActive={page === currentPage}
          onChange={page !== pagePlaceholder ? () => onChange(page) : null}
        >
          {page || '…'}
        </Control>
      ))}

      <Control disabled={currentPage >= numPages} onChange={() => onChange(currentPage + 1)}>
        <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />
      </Control>
    </div>
  );
}

export function getSteps(currentPage, numPages) {
  const pagesBefore = [];
  for (let i = Math.max(1, currentPage - 2); i < currentPage; i++) {
    pagesBefore.push(i);
  }

  const pagesAfter = [];
  for (let i = currentPage + 1; i <= Math.min(numPages, currentPage + 2); i++) {
    pagesAfter.push(i);
  }

  const lastPageValue = pagesAfter[pagesAfter.length - 1] || numPages;
  const pagesOnTheLeft = pagesBefore[0] - 1 || 0;
  const pagesOnTheRight = numPages - lastPageValue;

  if (pagesOnTheLeft === 1) {
    pagesBefore.unshift(1);
  } else if (pagesOnTheLeft > 1) {
    pagesBefore.unshift(pagePlaceholder);
    pagesBefore.unshift(1);
  }
  if (pagesOnTheRight === 1) {
    pagesAfter.push(numPages);
  } else if (pagesOnTheRight > 1) {
    pagesAfter.push(pagePlaceholder);
    pagesAfter.push(numPages);
  }

  return [...pagesBefore, currentPage, ...pagesAfter];
}

function Control({ disabled, isActive, onChange, children }) {
  return (
    <div
      className={classNames({
        [locals.control]: true,
        [locals.active]: isActive,
        [locals.disabled]: disabled || !onChange
      })}
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        if (!disabled && onChange) {
          onChange();
        }
      }}
    >
      {children}
    </div>
  );
}
