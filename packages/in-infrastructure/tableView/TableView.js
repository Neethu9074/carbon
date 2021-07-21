/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import InfraPageHeaderWithTabs from 'in-infrastructure/components/InfraPageHeaderWithTabs';
import useOldBackgroundColor from 'in-infrastructure/hooks/useOldBackgroundColor';
import TableWrapper from 'in-infrastructure/tableView/components/TableWrapper';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function TableView() {
  useOldBackgroundColor();
  return (
    <InfraPageHeaderWithTabs>
      <ViewTrackingMeta
        data={{
          productArea: 'Infrastructure',
          pageRootName: 'Infra Comparison Table'
        }}
      />

      <Title title={t('in-infrastructure:tableView.infrastructureComparisonTable')} />
      <TableWrapper />
    </InfraPageHeaderWithTabs>
  );
}
