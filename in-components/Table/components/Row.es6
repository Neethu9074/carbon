import React from 'react';

export default class Row extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.row.key !== nextProps.row.key || this.props.row.mutationCount !== nextProps.row.mutationCount;
  }

  render() {
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
