/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
          productArea: t('in-infrastructure:tableView.infrastructure'),
          pageRootName: t('in-infrastructure:tableView.infraComparisonTable')
        }}
      />

      <Title title={t('in-infrastructure:tableView.infrastructureComparisonTable')} />
      <TableWrapper />
    </InfraPageHeaderWithTabs>
  );
}
