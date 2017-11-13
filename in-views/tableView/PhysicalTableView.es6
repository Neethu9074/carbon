import React from 'react';

import TableView from 'in-views/tableView/TableView';

const domains = {
  host: 'Hosts',
  jvm: 'JVMs',
  nodejs: 'Node.js Apps',
  docker: 'Docker Containers',
  process: 'Processes'
};

export default function PhysicalTableView() {
  return <TableView domains={domains} />;
}
