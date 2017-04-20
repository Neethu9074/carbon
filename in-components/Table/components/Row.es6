import React from 'react';

export default class Row extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.lastRowKey !== nextProps.row.key || this.lastMutationCount !== nextProps.row.mutationCount;
  }

  render() {
    this.lastRowKey = this.props.row.key;
    this.lastMutationCount = this.props.row.mutationCount;

    return (
      <tr className={this.props.rowClassName}>
        {this.props.row.columns.map((column, i) => (
          <td key={i} className={this.props.cellClassName}>
            {column.content}
          </td>
        ))}
      </tr>
    );
  }
}
