/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import BrowserTopList from 'in-websites/WebsiteDashboard/components/BrowserTopList';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';

const metrics = ['pageLoads', 'uniqueUsersOrSessions'];
const labels = [
  t('in-websites:websiteDashboard.tabs.user.browserTopListLabelPageLoads'),
  t('in-websites:websiteDashboard.tabs.user.browserTopListLabelUsers')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function BrowserTopListWrapper(props) {
  return (
    <BrowserTopList
      {...props}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      beaconType="pageLoad"
    />
  );
}
