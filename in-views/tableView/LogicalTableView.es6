import React from 'react';

import { setSelectedType } from 'in-views/tableView/stores/snapshotIds';
import LifecycleObserver from 'in-components/LifecycleObserver';
import TableView from 'in-views/tableView/TableView';

// This list exists because we have the special type
// "service" which is an aggregation of multiple types.
const domains = {
  service: 'Services'
};

export default function LogicalTableView() {
  return [
    <LifecycleObserver key="0" onWillMount={() => setSelectedType('service')} />,
    <TableView domains={domains} key="1" />
  ];
}
