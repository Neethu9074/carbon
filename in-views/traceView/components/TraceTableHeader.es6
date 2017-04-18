import React from 'react';

import { setSortDirection, sortDirection$ } from 'in-views/traceView/stores/sortDirection';
import { setSortBy, sortBy$ } from 'in-views/traceView/stores/sortBy';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TraceTableHeader.less';

const block = 'in-trace-table-header';
const cellClassName = block + '__cell';
const selectedClassName = cellClassName + '--selected';
const rpt = React.PropTypes;

export default connectTo(
  {
    sortDirection: sortDirection$,
    sortBy: sortBy$
  },
  TraceTableHeader
);

function TraceTableHeader({ sortDirection, sortBy }) {
  return (
    <div className={block}>
      <div className={cellClassName} />

      {renderCell('Timestamp', 'ts', sortDirection, sortBy)}

      <div className={cellClassName}>
        <div className={`${block}__cell-toggle`}>
          Call
        </div>
      </div>

      {renderCell('Duration', 'd', sortDirection, sortBy)}
      {renderCell('#Errors', 'total_error_count', sortDirection, sortBy)}

      <div className={cellClassName}>
        <div className={`${block}__cell-toggle`}>
          Service
        </div>
      </div>
    </div>
  );
}

TraceTableHeader.propTypes = {
  sortDirection: rpt.string,
  sortBy: rpt.string
};

function renderCell(name, field, sortDirection, sortBy) {
  const isSelected = sortBy === field;

  let toggleClassName = `${block}__cell-toggle`;
  if (isSelected) {
    toggleClassName += ` ${toggleClassName}--selected`;
  }

  return (
    <div
      onClick={() => onClick(field, sortBy, sortDirection)}
      className={cellClassName + getCellClassName(field, sortBy)}
    >
      <div className={toggleClassName}>
        {name}
        {getSortIcon(field, sortDirection, sortBy)}
      </div>
    </div>
  );
}

function onClick(sortBy, currentSortBy, sortDirection) {
  setSortBy(sortBy);

  if (currentSortBy === sortBy) {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  } else {
    setSortDirection('desc');
  }
}

function getSortIcon(cell, sortDirection, sortBy) {
  if (sortBy === cell) {
    const toggleClassName = `${block}__icon-wrapper`;

    let iconType = 'triangle_down';
    if (sortDirection === 'asc') {
      iconType = 'triangle_up';
    }

    return (
      <div className={toggleClassName} onClick={() => onClick(cell, sortBy, sortDirection)}>
        <SvgIcon className={`${block}__icon`} type={iconType} width={5} height={5} color="#6b8088" />
      </div>
    );
  }
  return null;
}

function getCellClassName(cell, sortBy) {
  if (sortBy === cell) {
    return ' ' + selectedClassName;
  }

  return '';
}
