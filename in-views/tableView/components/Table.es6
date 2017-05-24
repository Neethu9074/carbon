import React from 'react';

import { toggleSnapshotId, selectedSnapshotIds$ } from 'in-views/tableView/stores/selectedSnapshots';
import ChartsForSelectedEntities from 'in-views/tableView/components/ChartsForSelectedEntities';
import { supportTableView, getTableDefinition } from 'in-sdk/snapshot';
import RightHeader from 'in-views/tableView/components/RightHeader';
import { snapshots$ } from 'in-views/tableView/stores/snapshotIds';
import LeftHeader from 'in-views/tableView/components/LeftHeader';
import { plugin$ } from 'in-views/tableView/stores/snapshotIds';
import LoadingIndicator from 'in-components/LoadingIndicator';
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

    if (!snapshots) {
      return <LoadingIndicator type="dark" />;
    }

    const tableDefinition = getTableDefinition(plugin);
    const cols = tableDefinition.cols;
    let rows = snapshots.map(snapshot => {
      const snapshotId = snapshot.get('id');
      return {
        key: snapshotId,
        snapshotId: snapshotId,
        snapshot
      };
    });

    if (tableDefinition.preProcessRows) {
      rows = tableDefinition.preProcessRows(rows) || rows;
    }

    return (
      <div className={block}>
        <Table
          cols={cols}
          rows={rows}
          initialSortColumn={tableDefinition.initialSortColumn}
          initialSortDirection={tableDefinition.initialSortDirection}
          contentBetweenHeaderAndTable={<ChartsForSelectedEntities />}
          leftHeader={<LeftHeader />}
          rightHeader={<RightHeader />}
          selectedRowKeys={selectedSnapshotIds}
          onRowClick={row => toggleSnapshotId(row.key)}
          maxItemsPerPage={50}
        />
      </div>
    );
  }
);
