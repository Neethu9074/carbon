import React from 'react';

import OsTopList from 'in-websites/WebsiteDashboard/components/OsTopList';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';

const metrics = ['errors', 'uniqueUsers'];
const labels = ['Occurrences', 'Affected Users'];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function OsTopListWrapper(props) {
  return <OsTopList {...props} metrics={metrics} labels={labels} aggregations={aggregations} formatters={formatters} />;
}
