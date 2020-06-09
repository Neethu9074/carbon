import React from 'react';

import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import Table from 'in-views/tableView/components/Table';
import LegacyView from 'in-components/LegacyView';
import Title from 'in-components/Title';

export default function TableView() {
  return (
    <InfraPageHeaderWithTabs>
      <LegacyView />
      <Title title="Comparison Table" />
      <Table />
    </InfraPageHeaderWithTabs>
  );
}
