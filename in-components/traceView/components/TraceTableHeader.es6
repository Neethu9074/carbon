import React from 'react';

import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import {setSortBy, setSortDirection, sortDirection$, sortBy$} from '../traceViewStore';

import './TraceTableHeader.less';


const block = 'in-trace-table-header';
const cellClassName = block + '__cell';
const selectedClassName = cellClassName + '--selected';
const rpt = React.PropTypes;

export default connectTo({
    sortDirection: sortDirection$,
    sortBy: sortBy$
  },
  React.createClass({
    displayName: 'TraceTableHeader',

    propTypes: {
      sortDirection: rpt.string,
      sortBy: rpt.string
    },

    render() {
      return (
        <div className={block}>
          {this.renderCell('Timestamp', 'ts')}
          <span className={cellClassName}>
            Call
          </span>
          {this.renderCell('Resp. Time', 'd')}
        </div>
      );
    },

    renderCell(name, field) {
      return (
        <div onClick={() => this.onClick(field)}
             className={cellClassName + this.getCellClassName(field)}>
          {name}
          {this.getSortIcon(field)}
        </div>
      );
    },

    onClick(sortBy) {
      setSortBy(sortBy);
      setSortDirection(this.props.sortDirection === 'desc' ? 'asc' : 'desc');
    },

    getSortIcon(cell) {
      if (this.props.sortBy === cell) {
        if (this.props.sortDirection === 'desc') {
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
    },

    getCellClassName(cell) {
      if (this.props.sortBy === cell) {
        return ' ' + selectedClassName;
      }

      return '';
    }
  })
);
