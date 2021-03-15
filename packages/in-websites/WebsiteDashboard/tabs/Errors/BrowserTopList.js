/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BrowserTopList from 'in-websites/WebsiteDashboard/components/BrowserTopList';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['errors', 'uniqueUsersOrSessions'];
const labels = [
  t('in-websites:websiteDashboard.tabs.errors.browserTopListLabelOccurrences'),
  t('in-websites:websiteDashboard.tabs.errors.browserTopListLabelAffectedUsers')
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
      beaconType="error"
    />
  );
}
