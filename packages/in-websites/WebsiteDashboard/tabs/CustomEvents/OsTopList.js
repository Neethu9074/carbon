/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import OsTopList from 'in-websites/WebsiteDashboard/components/OsTopList';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';

const metrics = ['beaconCount', 'uniqueUsersOrSessions'];
const labels = [
  t('in-websites:websiteDashboard.tabs.customEvents.osTopListLabelOccurrences'),
  t('in-websites:websiteDashboard.tabs.customEvents.osTopListLabelUsers')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function OsTopListWrapper(props) {
  return (
    <OsTopList
      {...props}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      beaconType="custom"
    />
  );
}
