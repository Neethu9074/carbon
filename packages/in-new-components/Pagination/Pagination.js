import React from 'react';

import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import locals from './Pagination.mless';

export default function Pagination({ current, last, onChange, className }) {
  const prevDisabled = current < 2;
  const nextDisabled = current >= last;

  return (
    <div className={joinClassNames(locals.pagination, className)}>
      <a
        href="#"
        className={evaluateClassNames({
          [locals.action]: true,
          [locals.disabledAction]: prevDisabled
        })}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (!prevDisabled) {
            onChange(current - 1);
          }
        }}
      >
        Prev
      </a>

      <div className={locals.center}>
        <span className={locals.current}>{current}</span>
        <span className={locals.separator}>/</span>
        <span className={locals.last}>{last}</span>
      </div>

      <a
        href="#"
        className={evaluateClassNames({
          [locals.action]: true,
          [locals.disabledAction]: nextDisabled
        })}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (!nextDisabled) {
            onChange(current + 1);
          }
        }}
      >
        Next
      </a>
    </div>
  );
}
