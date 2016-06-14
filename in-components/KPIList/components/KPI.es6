import React from 'react';

import MetricValue from 'in-components/MetricValue';

import 'in-components/KPIList/components/KPI.less';


const block = 'in-kpi';

export default function kpi({snapshot, metric, formatter, label}) {
  return (
    <div className={block}>
      <div className={block + '__value'}>
        <MetricValue snapshotId={snapshot.get('id')}
                     metric={metric}
                     formatter={formatter}/>
      </div>
      <span className={block + '__label'}>
        {label}
      </span>
    </div>
  );
}
