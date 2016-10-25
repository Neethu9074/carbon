import React from 'react';

import {getRowDataForSnapshotId} from 'in-views/tableView/stores/content';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import connectTo from 'in-hoc/connectTo';

import './TableRow.less';

const block = 'in-table-view-table-row';
const cellClassName = `${block}__cell`;

export default connectTo(props => {
  return {
    rowData: getRowDataForSnapshotId(props.snapshotId)
  };
}, function TableRow({rowData, snapshotId}) {
  if (!rowData || rowData.columns.length === 0) {
    return null;
  }

  return (
    <div className={block}>
      {rowData.columns.map((column, i) =>
        <div className={cellClassName}
             style={column.style}
             key={i}>
          {column.content || <span>&nbsp;</span>}
        </div>
      )}
      <div className={cellClassName}>
        <AnnotatedHealthBar snapshotId={snapshotId} />
      </div>
    </div>
  );
});
