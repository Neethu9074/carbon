import React from 'react';

import { toggleSnapshotId, selectedSnapshotIds$ } from 'in-views/tableView/stores/selectedSnapshots';
import ChartsForSelectedEntities from 'in-views/tableView/components/ChartsForSelectedEntities';
import { supportTableView, getTableDefinition } from 'in-sdk/snapshot';
import RightHeader from 'in-views/tableView/components/RightHeader';
import LeftHeader from 'in-views/tableView/components/LeftHeader';
import { plugin$ } from 'in-views/tableView/stores/snapshotIds';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { data$ } from 'in-views/tableView/stores/snapshotIds';
import { getPlural } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

import './Table.less';

const block = 'in-table-view-table';

export default connectTo(
  {
    data: data$,
    selectedSnapshotIds: selectedSnapshotIds$,
    plugin: plugin$
  },
  function TableViewTable({ data, plugin, selectedSnapshotIds }) {
    if (!data || !data.snapshots || data.plugin !== plugin || !plugin) {
      return <LoadingIndicator type="dark" />;
    }

    if (!supportTableView(plugin)) {
      return (
        <div className={`${block}__unsupported`}>Sorry, we do not yet support tables for {getPlural(plugin)}.</div>
      );
    }

    const tableDefinition = getTableDefinition(plugin);
    const cols = tableDefinition.cols;
    let rows = data.snapshots.map(snapshot => {
      const snapshotId = snapshot.get('id');
      const isSelected = selectedSnapshotIds.indexOf(snapshotId) >= 0;
      return {
        key: snapshotId,
        snapshotId: snapshotId,
        snapshot,
        isSelected
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
