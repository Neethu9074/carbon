import React from 'react';

import { toggleSnapshotId, selectedSnapshotIds$ } from 'in-views/tableView/stores/selectedSnapshots';
import ChartsForSelectedEntities from 'in-views/tableView/components/ChartsForSelectedEntities';
import { supportTableView, getTableDefinition } from 'in-sdk/snapshot';
import { snapshots$ } from 'in-views/tableView/stores/snapshotIds';
import { plugin$ } from 'in-views/tableView/stores/snapshotIds';
import Header from 'in-views/tableView/components/Header';
import { emptyArray } from 'in-services/fixedObjects';
import { getPlural } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

import './Table.less';

const block = 'in-table-view-table';

export default connectTo(
  {
    snapshots: snapshots$,
    selectedSnapshotIds: selectedSnapshotIds$,
    plugin: plugin$
  },
  function TableViewTable({ snapshots, plugin, selectedSnapshotIds }) {
    if (!supportTableView(plugin)) {
      return (
        <div className={`${block}__unsupported`}>
          Sorry, we do not yet support tables for {getPlural(plugin)}.
        </div>
      );
    }

    snapshots = snapshots || emptyArray;

    const cols = getTableDefinition(plugin);
    const rows = snapshots.map(snapshot => {
      const snapshotId = snapshot.get('id');
      return {
        key: snapshotId,
        snapshotId: snapshotId,
        snapshot
      };
    });

    return (
      <div className={block}>
        <Table
          cols={cols}
          rows={rows}
          contentBetweenHeaderAndTable={<ChartsForSelectedEntities />}
          leftHeader={<Header />}
          selectedRowKeys={selectedSnapshotIds}
          onRowClick={row => toggleSnapshotId(row.key)}
          maxItemsPerPage={50}
        />
      </div>
    );
  }
);
