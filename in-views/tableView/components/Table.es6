import React from 'react';

import { supportTableView, getTableDefinition } from 'in-sdk/snapshot';
import { snapshots$ } from 'in-views/tableView/stores/snapshotIds';
import { plugin$ } from 'in-views/tableView/stores/snapshotIds';
import { getPlural } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

import './Table.less';

const block = 'in-table-view-table';

export default connectTo(
  {
    snapshots: snapshots$,
    plugin: plugin$
  },
  function TableViewTable({ snapshots, plugin }) {
    if (!supportTableView(plugin)) {
      return (
        <div className={`${block}__unsupported`}>
          Sorry, we do not yet support tables for {getPlural(plugin)}.
        </div>
      );
    }

    if (!snapshots) {
      return null;
    }

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
        <Table cols={cols} rows={rows} />
      </div>
    );
  }
);
