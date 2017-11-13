import React from 'react';

import { setSelectedType } from 'in-views/tableView/stores/snapshotIds';
import LifecycleObserver from 'in-components/LifecycleObserver';
import TableView from 'in-views/tableView/TableView';

const domains = {
  host: 'Hosts',
  jvm: 'JVMs',
  nodejs: 'Node.js Apps',
  docker: 'Docker Containers',
  process: 'Processes'
};

export default function PhysicalTableView() {
  return [
    <LifecycleObserver key="0" onWillMount={() => setSelectedType('host')} />,
    <TableView domains={domains} key="1" />
  ];
}
