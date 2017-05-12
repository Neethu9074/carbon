import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './Row.less';

const block = 'in-table-row';
const selectedRow = `${block}--selected`;
const clickableRow = `${block}--clickable`;

const expand = <SvgIcon type="timeline_open" width={12} className={`${block}__toggle`} />;
const collapse = <SvgIcon type="timeline_close" width={12} className={`${block}__toggle`} />;

export default class Row extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.lastRowKey !== nextProps.row.key || this.lastMutationCount !== nextProps.row.mutationCount;
  }

  render() {
    this.lastRowKey = this.props.row.key;
    this.lastMutationCount = this.props.row.mutationCount;

    let rowClasses = `${block} ${this.props.rowClassName}`;
    if (this.props.row.selected) {
      rowClasses += ' ' + selectedRow;
    }
    if (this.props.onClick) {
      rowClasses += ' ' + clickableRow;
    }

    return (
      <tr className={rowClasses} onClick={this.onClick}>
        {this.props.toggleRowDetails
          ? <td className={this.props.cellClassName} onClick={() => this.props.toggleRowDetails(this.props.row.key)}>
              {this.props.row.expanded ? collapse : expand}
            </td>
          : null}

        {this.props.row.columns.map((column, i) => (
          <td key={i} className={this.props.cellClassName} style={column.columnDefinition.cellStyle}>
            {column.content}
          </td>
        ))}
      </tr>
    );
  }

  onClick(e) {
    if (!this.props.onClick) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.props.onClick(this.props.row);
  }
}
