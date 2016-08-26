import React from 'react';

import {setSortDirection, sortDirection$} from 'in-components/traceView/stores/sortDirection';
import {setSortBy, sortBy$} from 'in-components/traceView/stores/sortBy';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TraceTableHeader.less';

const block = 'in-trace-table-header';
const cellClassName = block + '__cell';
const selectedClassName = cellClassName + '--selected';
const rpt = React.PropTypes;

export default connectTo({
    sortDirection: sortDirection$,
    sortBy: sortBy$
  }, TraceTableHeader);

function TraceTableHeader({sortDirection, sortBy}) {
  return (
    <div className={block}>
      {renderCell('Timestamp', 'ts', sortDirection, sortBy)}
      <span className={cellClassName}>
        Call
      </span>
      {renderCell('Resp. Time', 'd', sortDirection, sortBy)}
      {renderCell('Error Count', 'total_error_count', sortDirection, sortBy)}
    </div>
  );
}

TraceTableHeader.propTypes = {
  sortDirection: rpt.string,
  sortBy: rpt.string
};

function renderCell(name, field, sortDirection, sortBy) {
  return (
    <div onClick={() => onClick(field, sortBy, sortDirection)}
         className={cellClassName + getCellClassName(field, sortBy)}>
      {name}
      {getSortIcon(field, sortDirection, sortBy)}
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
    if (sortDirection === 'asc') {
      return (
        <SvgIcon type='chevron_up'
                 className={cellClassName + '__sort-icon'}
                 width={8} />
      );
    }
    return (
      <SvgIcon className={cellClassName + '__sort-icon'}
               type='chevron_down'
               width={8} />
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
