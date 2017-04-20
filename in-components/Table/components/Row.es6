import React from 'react';

import { shouldPresentValueAsPercentage } from 'in-components/Table/stores/content';
import PercentageCell from 'in-components/Table/components/PercentageCell';
import SvgIcon from 'in-components/SvgIcon';

import './Row.less';

const block = 'in-table-row';

const expand = <SvgIcon type="timeline_open" width={12} className={`${block}__toggle`} />;
const collapse = <SvgIcon type="timeline_close" width={12} className={`${block}__toggle`} />;

export default class Row extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.lastRowKey !== nextProps.row.key || this.lastMutationCount !== nextProps.row.mutationCount;
  }

  render() {
    this.lastRowKey = this.props.row.key;
    this.lastMutationCount = this.props.row.mutationCount;

    return (
      <tr className={this.props.rowClassName}>
        {this.props.toggleRowDetails
          ? <td className={this.props.cellClassName} onClick={() => this.props.toggleRowDetails(this.props.row.key)}>
              {this.props.row.expanded ? collapse : expand}
            </td>
          : null}

        {this.props.row.columns.map((column, i) => (
          <td key={i} className={this.props.cellClassName}>
            {getContent(this.props.row, column)}
          </td>
        ))}
      </tr>
    );
  }
}

function getContent(row, column) {
  if (column.columnDefinition.type === 'string') {
    return column.content;
  } else if (column.columnDefinition.type === 'number') {
    return column.content;
  } else if (column.columnDefinition.type === 'metric') {
    if (column.value == null) {
      return column.columnDefinition.typeArgs.fallbackContent;
    }

    const content = column.columnDefinition.typeArgs.getContent(column.value, row.rowConfig);
    if (shouldPresentValueAsPercentage(column.columnDefinition.typeArgs.getContent)) {
      return <PercentageCell value={column.value} content={content} />;
    }
    return content;
  }

  throw new Error('Unsupported column type: ' + column.columnDefinition.type);
}
