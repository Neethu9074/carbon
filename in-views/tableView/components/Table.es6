import React from 'react';

import { supportTableView, getTableDefinition } from 'in-sdk/snapshot';
import { sortedSnapshotIds$ } from 'in-views/tableView/stores/sorting';
import { plugin$ } from 'in-views/tableView/stores/snapshotIds';
import { getPlural } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

import './Table.less';

const block = 'in-table-view-table';

export default connectTo(
  {
    snapshotIds: sortedSnapshotIds$,
    plugin: plugin$
  },
  function TableViewTable({ snapshotIds, plugin }) {
    if (!supportTableView(plugin)) {
      return (
        <div className={`${block}__unsupported`}>
          Sorry, we do not yet support tables for {getPlural(plugin)}.
        </div>
      );
    }

    const cols = getTableDefinition(plugin);
    const rows = snapshotIds.map(snapshotId => {
      return {
        key: snapshotId,
        snapshotId
      };
    });

    return (
      <div className={block}>
        <Table cols={cols} rows={rows} />
      </div>
    );
  }
);
