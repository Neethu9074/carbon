import React from 'react';

import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import Table from 'in-views/tableView/components/Table';
import LegacyView from 'in-components/LegacyView';
import Title from 'in-components/Title';

export default function TableView() {
  return (
    <InfraPageHeaderWithTabs>
      <LegacyView />
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Comparison Table'
        }}
      />

      <Title title="Infrastructure Comparison Table" />
      <Table />
    </InfraPageHeaderWithTabs>
  );
}
