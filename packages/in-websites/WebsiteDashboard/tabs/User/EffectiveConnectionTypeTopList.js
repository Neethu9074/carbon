/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EffectiveConnectionTypeTopList from 'in-websites/WebsiteDashboard/components/EffectiveConnectionTypeTopList';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['pageLoads', 'uniqueUsersOrSessions'];
const labels = [
  t('in-websites:websiteDashboard.tabs.user.effectiveConnectionTypeTopListLabelPageLoads'),
  t('in-websites:websiteDashboard.tabs.user.effectiveConnectionTypeTopListLabelUsers')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function EffectiveConnectionTypeTopListWrapper(props) {
  return (
    <EffectiveConnectionTypeTopList
      {...props}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      beaconType="pageLoad"
    />
  );
}
