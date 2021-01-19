/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { toggleSnapshotId, selectedSnapshotIds$ } from 'in-infrastructure/tableView/stores/selectedSnapshots';
import ChartsForSelectedEntities from 'in-infrastructure/tableView/components/ChartsForSelectedEntities';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { supportTableView, getTableDefinition } from 'in-sdk/snapshot';
import RightHeader from 'in-infrastructure/tableView/components/RightHeader';
import LeftHeader from 'in-infrastructure/tableView/components/LeftHeader';
import { plugin$ } from 'in-infrastructure/tableView/stores/snapshotIds';
import { data$ } from 'in-infrastructure/tableView/stores/snapshotIds';
import Table from 'in-infrastructure/tableView/components/Table';
import { getPlural } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './Table.less';

const block = 'in-table-view-table';

export default connectTo(
  {
    data: data$,
    selectedSnapshotIds: selectedSnapshotIds$,
    plugin: plugin$
  },
  function TableWrapper({ data, plugin, selectedSnapshotIds }) {
    if (!data || !data.snapshots || data.plugin !== plugin || !plugin) {
      return <LoadingIndicator />;
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
          onRowClick={row => toggleSnapshotId(row.key, row.snapshot ? row.snapshot.get('plugin') : null)}
          maxItemsPerPage={50}
        />
      </div>
    );
  }
);
