import React from 'react';

import { column$, direction$, invertDirection, setColumn, setDirection } from 'in-views/tableView/stores/sorting';
import { getTableDefinition } from 'in-sdk/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TableHeader.less';

const block = 'in-table-view-table-header';
const cellClassName = `${block}__cell`;

export default connectTo(
  {
    selectedColumn: column$,
    direction: direction$
  },
  function TableHeader({ plugin, selectedColumn, direction }) {
    const tableDefinition = getTableDefinition(plugin);
    return (
      <div className={block}>
        {tableDefinition.map((column, i) => {
          let style;
          if (column.style && (column.style.maxWidth || column.style.minWidth)) {
            style = {
              maxWidth: column.style.maxWidth,
              minWidth: column.style.minWidth
            };
          }

          let classes = cellClassName;
          if (selectedColumn === i) {
            classes = `${classes} ${cellClassName}--selected`;
          }

          return (
            <p
              className={classes}
              style={style}
              key={i}
              onClick={() => {
                if (i === selectedColumn) {
                  invertDirection();
                } else {
                  setDirection(column.defaultSortDirection || 'asc');
                  setColumn(i);
                }
              }}
            >
              {column.title}

              <Arrow isActive={i === selectedColumn} sortDirection={direction} />
            </p>
          );
        })}
      </div>
    );
  }
);

function Arrow({ isActive, sortDirection }) {
  if (!isActive) {
    return null;
  }

  let iconType = 'triangle_up';
  if (sortDirection === 'desc') {
    iconType = 'triangle_down';
  }

  return (
    <span className={`${block}__icon-wrapper`}>
      <SvgIcon className={`${block}__icon`} type={iconType} width={5} height={5} color="#6b8088" />
    </span>
  );
}
