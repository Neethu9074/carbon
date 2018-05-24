import React from 'react';

import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

export default function AnalyzeTracesBreadcrumb() {
  return <Breadcrumb href$={getLinkToAnalyze()}>Traces</Breadcrumb>;
}
