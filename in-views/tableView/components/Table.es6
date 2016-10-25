import React from 'react';

import TableHeader from 'in-views/tableView/components/TableHeader';
import {snapshotIds$} from 'in-views/tableView/stores/content';
import TableRow from 'in-views/tableView/components/TableRow';
import connectTo from 'in-hoc/connectTo';

import './Table.less';

const block = 'in-table-view-table';

const plugin = 'host';

export default connectTo({
  snapshotIds: snapshotIds$
}, function Table({snapshotIds}) {
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
