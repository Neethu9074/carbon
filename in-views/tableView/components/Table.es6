import React from 'react';

import TableHeader from 'in-views/tableView/components/TableHeader';
import {sortedSnapshotIds$} from 'in-views/tableView/stores/sorting';
import {plugin$} from 'in-views/tableView/stores/snapshotIds';
import TableRow from 'in-views/tableView/components/TableRow';
import {supportTableView} from 'in-sdk/snapshot';
import {getPlural} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './Table.less';

const block = 'in-table-view-table';

export default connectTo({
  snapshotIds: sortedSnapshotIds$,
  plugin: plugin$
}, function Table({snapshotIds, plugin}) {
  if (!supportTableView(plugin)) {
    return (
      <div className={`${block}__unsupported`}>
        Sorry, we do not yet support tables for {getPlural(plugin)}.
      </div>
    );
  }

  return (
    <div className={block}>
      <TableHeader plugin={plugin} />

      <div className={`${block}__rows`}>
        {snapshotIds ? snapshotIds.map(snapshotId =>
          <TableRow snapshotId={snapshotId}
                    key={snapshotId}
                    plugin={plugin} />
        ) : null}
      </div>
    </div>
  );
});
