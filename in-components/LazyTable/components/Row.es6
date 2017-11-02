import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Cell from 'in-components/LazyTable/components/Cell';
import connectTo from 'in-hoc/connectTo';

import './Row.less';

const block = 'in-lazy-table-row';

export default connectTo(
  props => {
    if (props.rowSubscriptions) {
      return props.rowSubscriptions(props.row);
    }
    return {};
  },
  function Row(props) {
    const { row, cols, onRowClicked } = props;

    return (
      <div
        className={evaluateClassNames({
          [block]: true,
          [`${block}--selected`]: row.isSelected
        })}
        onClick={() => onRowClicked(row)}
      >
        {cols.map(col => (
          <Cell key={col.title} col={col}>
            {col.getContent(row, props)}
          </Cell>
        ))}
      </div>
    );
  }
);
