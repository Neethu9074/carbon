import React from 'react';

import TableHeader from 'in-views/tableView/components/TableHeader';
import {sortedSnapshotIds$} from 'in-views/tableView/stores/sorting';
import {plugin$} from 'in-views/tableView/stores/snapshotIds';
import TableRow from 'in-views/tableView/components/TableRow';
import connectTo from 'in-hoc/connectTo';

import './Table.less';

const block = 'in-table-view-table';

export default connectTo({
  snapshotIds: sortedSnapshotIds$,
  plugin: plugin$
}, function Table({snapshotIds, plugin}) {
  return (
    <div className={block}>
      <TableHeader plugin={plugin} />

      <div className={`${block}__rows`}>
        {snapshotIds ? snapshotIds.map(snapshotId =>
            <TableRow snapshotId={snapshotId}
                      key={snapshotId} />
        ) : null}
      </div>
    </div>
  );
});
