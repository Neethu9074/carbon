/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import Breadcrumbs from 'in-logging/dashboard/Management/Breadcrumbs';
import { t } from 'in-i18n';

import locals from 'in-logging/dashboard/Management/Management.mless';

export default function PatternRecognition() {
  return (
    <>
      <LoggingDashboardWrapper
        title={t('in-logging:dashboard.managementPage.patternRecognition')}
        withButton={false}
        withTabs={false}
        withTimeSelection={false}
      >
        <Breadcrumbs />
        <section className={locals.content}>{t('in-logging:dashboard.managementPage.patternRecognition')}</section>
      </LoggingDashboardWrapper>
    </>
  );
}
