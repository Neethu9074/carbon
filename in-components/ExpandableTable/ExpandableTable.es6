import irpt from 'react-immutable-proptypes';
import { Iterable } from 'immutable';
import rpt from 'prop-types';
import React from 'react';

import './ExpandableTable.less';

const block = 'in-expandable-table';

export default class extends React.Component {
  static displayName = 'ExpandableTable';

  static propTypes = {
    data: rpt.oneOfType([rpt.array, rpt.object, irpt.iterable]).isRequired,
    getKey: rpt.func.isRequired,
    createHeader: rpt.func.isRequired,
    createRow: rpt.func.isRequired,
    createDetails: rpt.func,
    context: rpt.any
  };

  state = {
    selectedKeys: new Map()
  };

  render() {
    let classes = block;
    if (this.props.createDetails != null) {
      classes += ' ' + block + '__clickable';
    }

    return (
      <table className={classes}>
        {this.props.createHeader(this.props.context)}

        <tbody>
          {this.flatMapRows(this.createRow)}
        </tbody>
      </table>
    );
  }

  flatMapRows = mapperFn => {
    let result = [];
    const data = this.props.data;
    const context = this.props.context;

    if (Iterable.isIterable(data)) {
      data.forEach((val, index) => {
        const rows = mapperFn(val, index, context);
        result = result.concat(rows);
      });
    } else if (data instanceof Array) {
      for (let i = 0, len = data.length; i < len; i++) {
        const rows = mapperFn(data[i], i, context);
        result = result.concat(rows);
      }
    } else {
      for (const index in data) {
        if (data.hasOwnProperty(index)) {
          const rows = mapperFn(data[index], index, context);
          result = result.concat(rows);
        }
      }
    }

    return result;
  };

  createRow = (val, index, context) => {
    const key = this.props.getKey(val, index, context);
    const rowContent = this.props.createRow(val, index, context);
    const isSelected = this.state.selectedKeys.has(key);

    // create row this way to avoid usage of child element arrays (which would result in
    // warnings due to missing key props).
    let rowArgs = [
      'tr',
      {
        key,
        onClick: this.props.createDetails ? () => this.onClick(key) : null,
        className: isSelected ? 'active' : null
      }
    ];
    rowArgs = rowArgs.concat(rowContent);
    const row = React.createElement.apply(React, rowArgs);

    if (!isSelected) {
      return [row];
    }

    return [
      row,
      <tr key={key + '--details'}>
        <td colSpan="100" className={block + '__details'}>
          {this.props.createDetails(val, index, context)}
        </td>
      </tr>
    ];
  };

  onClick = key => {
    this.setState(state => {
      if (state.selectedKeys.has(key)) {
        state.selectedKeys.delete(key);
      } else {
        state.selectedKeys.set(key, true);
      }
      return {
        selectedKeys: state.selectedKeys
      };
    });
  };
}
