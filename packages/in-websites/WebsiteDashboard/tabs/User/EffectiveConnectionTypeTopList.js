import React from 'react';

import EffectiveConnectionTypeTopList from 'in-websites/WebsiteDashboard/components/EffectiveConnectionTypeTopList';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';

const metrics = ['pageLoads', 'uniqueUsers'];
const labels = ['Page Loads', 'Users'];
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
    />
  );
}
