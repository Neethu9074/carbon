import React from 'react';

import {isSelected, toggleSnapshotId} from 'in-views/tableView/stores/selectedSnapshots';
import {getRowDataForSnapshotId} from 'in-views/tableView/stores/content';
import connectTo from 'in-hoc/connectTo';

import './TableRow.less';

const block = 'in-table-view-table-row';
const cellClassName = `${block}__cell`;

export default connectTo(props => {
  return {
    rowData: getRowDataForSnapshotId(props.snapshotId),
    selected: isSelected(props.snapshotId)
  };
}, function TableRow({rowData, selected, snapshotId}) {
  if (!rowData || rowData.columns.length === 0) {
    return null;
  }

  let rowClassName = block;
  if (selected) {
    rowClassName += ` ${block}--selected`;
  }

  return (
    <div className={rowClassName}
         onClick={() => toggleSnapshotId(snapshotId)}>
      {rowData.columns.map((column, i) =>
        <div className={cellClassName}
             style={column.style}
             key={i}>
          {column.content || <span>&nbsp;</span>}
        </div>
      )}
    </div>
  );
});
