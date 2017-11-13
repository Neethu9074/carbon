import React from 'react';

import TableView from 'in-views/tableView/TableView';

// This list exists because we have the special type
// "service" which is an aggregation of multiple types.
const domains = {
  service: 'Services'
};

export default function LogicalTableView() {
  return <TableView domains={domains} />;
}
