import React from 'react';

import TableHeader from 'in-views/tableView/components/TableHeader';
import TableRow from 'in-views/tableView/components/TableRow';
import {physicalViewStructure$} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

import './Table.less';

const block = 'in-table-view-table';

const hosts$ = physicalViewStructure$
  .map(viewStructure => {
    const hosts = [];

    viewStructure.get('children')
      .forEach(zone => {
        zone.get('children')
          .forEach(host => {
            const id = host.get('id');
            if (id.indexOf('unmon-host=') !== 0) {
              hosts.push(host.get('id'));
            }
          });
      });

    return hosts;
  });

export default connectTo({
  hosts: hosts$
}, function Table({hosts}) {
  return (
    <div className={block}>
      <TableHeader />

      <div className={`${block}__rows`}>
        {hosts ?
          hosts.map(host =>
            <TableRow snapshotId={host}
                      key={host} />
          )
        : null}
      </div>
    </div>
  );
});
