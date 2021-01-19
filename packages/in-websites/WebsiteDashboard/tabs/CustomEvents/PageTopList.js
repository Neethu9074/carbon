/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PageTopList from 'in-websites/WebsiteDashboard/components/PageTopList';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';

const metrics = ['beaconCount', 'uniqueUsersOrSessions'];
const labels = ['Occurrences', 'Users'];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function PageTopListWrapper(props) {
  return (
    <PageTopList
      {...props}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      beaconType="custom"
      tabPath="/customEvents"
    />
  );
}
