import irpt from 'react-immutable-proptypes';
import React from 'react';

import MetricValue from 'in-components/MetricValue';

import 'in-components/KPIList/KPIList.less';


const rpt = React.PropTypes;
const block = 'in-kpi-list';

export default function KPIList({formatters, metrics, labels, snapshot}) {
  const kpiClass = block + '__kpi';
  return (
    <ul className={block}>
      {metrics.map((metric, index) =>
        <li key={labels[index]}
            className={kpiClass}>
          <div className={kpiClass + '__value'}>
            <MetricValue snapshotId={snapshot.get('id')}
                         metric={metric}
                         formatter={formatters[index]}/>
          </div>
          <span className={kpiClass + '__label'}>
            {labels[index]}
          </span>
        </li>
      )}
    </ul>
  );
}

KPIList.propTypes = {
  formatters: rpt.array.isRequired,
  snapshot: irpt.map.isRequired,
  metrics: rpt.array.isRequired,
  labels: rpt.array.isRequired
};
