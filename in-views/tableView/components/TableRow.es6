import React from 'react';

import {isSelected, toggleSnapshotId} from 'in-views/tableView/stores/selectedSnapshots';
import {getRowDataForSnapshotId} from 'in-views/tableView/stores/content';
import {getSnapshot} from 'in-stores/snapshot';
import {plugins} from 'in-forge/constants';
import connectTo from 'in-hoc/connectTo';

import './TableRow.less';

const block = 'in-table-view-table-row';
const cellClassName = `${block}__cell`;

export default connectTo(props => {
  return {
    rowData: getRowDataForSnapshotId(props.snapshotId),
    selected: isSelected(props.snapshotId),
    snapshot: getSnapshot(props.snapshotId)
  };
}, function TableRow({rowData, selected, snapshotId, plugin, snapshot}) {
  // Ben 2016-12-20
  // A small hack to support aggregations for services.
  // Consider revisiting this when we have more of these aggregations.
  if (plugin !== plugins.defaultLogicalService &&
      // Search will list Dropwizard apps when we match JVMs (and similar cases).
      // Protect against varying column definitions being used in the same table.
      snapshot && snapshot.get('plugin') !== plugin) {
    return null;
  }

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
