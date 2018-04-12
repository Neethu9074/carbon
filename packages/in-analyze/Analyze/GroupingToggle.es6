import React from 'react';

import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Link from 'in-components/Link';

export default function GroupingToggle({ raw }) {
  // toggle grouped/raw mode
  const routeChangeParams = {
    raw: !raw
  };
  if (raw) {
    // delete traceGroupName when leaving raw mode
    routeChangeParams.traceGroupName = null;
  }
  return <Link href$={getLinkToAnalyze(routeChangeParams)}>{raw ? '-> Grouped' : '-> Raw'}</Link>;
}
