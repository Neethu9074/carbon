import React from 'react';

import {setSortBy, setSortDirection, sortDirection$, sortBy$} from 'in-components/traceView/traceViewStore';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

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
    </div>
  );
}

TraceTableHeader.propTypes = {
  sortDirection: rpt.string,
  sortBy: rpt.string
};

function renderCell(name, field, sortDirection, sortBy) {
  return (
    <div onClick={() => onClick(field, sortDirection)}
         className={cellClassName + getCellClassName(field, sortBy)}>
      {name}
      {getSortIcon(field, sortDirection, sortBy)}
    </div>
  );
}

function onClick(sortBy, sortDirection) {
  setSortBy(sortBy);
  setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
}

function getSortIcon(cell, sortDirection, sortBy) {
  if (sortBy === cell) {
    if (sortDirection === 'asc') {
      return (
        <Icon className={cellClassName + '__sort-icon'}
              type={'up'}/>
      );
    }
    return (
      <Icon className={cellClassName + '__sort-icon'}
            type={'down'}/>
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
