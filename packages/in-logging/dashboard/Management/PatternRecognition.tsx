/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { AILabel, AILabelContent } from '@carbon/react';
import React from 'react';

import { DataTable, Pagination } from '@instana/components';

import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import Breadcrumbs from 'in-logging/dashboard/Management/Breadcrumbs';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

import locals from 'in-logging/dashboard/Management/Management.mless';

export default function PatternRecognition() {
  return (
    <LoggingDashboardWrapper
      title={t('in-logging:dashboard.managementPage.patternRecognition')}
      withButton={false}
      withTabs={false}
      withTimeSelection={false}
    >
      <Breadcrumbs />
      <section className={locals.content}>{t('in-logging:dashboard.managementPage.patternRecognition')}</section>
      <KpiCard title={'Current patterns'} noTooltipOnTitle />
      <br />

      <DataTable
        title="Pattern Recognition"
        headers={[]}
        rows={[]}
        toolBarContent={
          <AILabel>
            <AILabelContent>{'Test'}</AILabelContent>
          </AILabel>
        }
      />
      <Pagination pageSize={10} />
    </LoggingDashboardWrapper>
  );
}
