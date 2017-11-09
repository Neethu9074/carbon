import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import './Column.less';

const block = 'in-lazy-table-column';

export default function Column({ col, onClick, isSelected, sortDirection }) {
  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [`${block}--selected`]: isSelected,
        [`${block}--clickable`]: col.field
      })}
      style={{ maxWidth: col.width, minWidth: col.width }}
      onClick={() => {
        if (col.field) {
          onClick(col.field);
        }
      }}
    >
      <div className={`${block}__content`}>
        {col.title}
        {isSelected ? (
          <SvgIcon
            className={`${block}__icon`}
            type={sortDirection === 'desc' ? 'triangle_down' : 'triangle_up'}
            width={5}
            height={5}
            color="#6B8088"
          />
        ) : null}
      </div>
    </div>
  );
}
