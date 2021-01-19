/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import TableWrapper from 'in-infrastructure/tableView/components/TableWrapper';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
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
      <TableWrapper />
    </InfraPageHeaderWithTabs>
  );
}
