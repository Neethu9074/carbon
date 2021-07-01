/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { ApplicationHealthOverviewPresenter } from 'in-custom-dashboards/widgets/ApplicationHealth/ApplicationHealthOverviewPresenter';
import { t } from 'in-i18n';

import locals from './ShowCase.mless';

export default function ShowCase() {
  return (
    <div className={locals.wrapper}>
      <ApplicationHealthOverviewPresenter
        title={t('in-custom-dashboards:widgets.applicationHealth.index.applicationHealth')}
        appsAndHealthInfo={{
          configWithHealthInfo: [
            { id: '1', label: 'k8s-demo', maxSeverity: 10, openIssues: 6 },
            { id: '2', label: 'kubernetes label not contain', maxSeverity: 4, openIssues: 2 },
            { id: '3', label: 'payment service', maxSeverity: 0, openIssues: 0 },
            { id: '4', label: 'All Services', maxSeverity: 0, openIssues: 0 },
            { id: '5', label: 'graphql-blogpost', maxSeverity: 0, openIssues: 0 },
            { id: '6', label: 'Java Demo App', maxSeverity: 0, openIssues: 0 },
            { id: '7', label: 'Net5Demo', maxSeverity: 0, openIssues: 0 },
            { id: '8', label: 'robot-shop', maxSeverity: 0, openIssues: 0 },
            { id: '9', label: 'robot-shop-test', maxSeverity: 0, openIssues: 0 }
          ],
          overallHealthStatus: { critical: 1, warning: 1, total: 9 }
        }}
        timeConfig={{}}
        isPreview
      />
    </div>
  );
}
