import React from 'react';

import locals from './Kpis.mless';

export default function AppKpiPresenter({ label, result, metricName, formatter }) {
  //TODO: Style me
  if (result.errors.length > 0) {
    return <div>{result.errors.join(',')}</div>;
  }

  if (result.progress.loading) {
    return <div>Loading...</div>;
  }

  const metricValue = result.data[metricName][0][1];
  return (
    <div className={locals.kpi}>
      <div className={locals.metric}>{formatter.detailed(metricValue)}</div>
      <div>{label}</div>
    </div>
  );
}
