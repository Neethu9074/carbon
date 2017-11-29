import React from 'react';

import Table from 'in-components/Table';

import './Table.less';

const block = 'in-dashboard-table';

export default function DashboardTable(props) {
  const newProps = { ...props, className: block };
  return <Table {...newProps} />;
}
