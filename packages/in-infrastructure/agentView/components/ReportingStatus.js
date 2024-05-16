/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t } from 'in-i18n';

export const reportingStatus = {
  ONLINE: {
    value: 0,
    Component: function onlineStatus() {
      return t('in-infrastructure:agentView.reporting');
    }
  },
  DEGRADED: {
    value: 1,
    Component: function degradedStatus({ count }) {
      return <span>{t('in-infrastructure:agentView.reportingMonitoringIssues', { count: count })}</span>;
    }
  },
  OFFLINE: {
    value: 2,
    Component: function offlineStatus() {
      return t('in-infrastructure:agentView.notReporting');
    }
  }
};
