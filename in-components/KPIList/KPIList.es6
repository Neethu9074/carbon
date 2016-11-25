import irpt from 'react-immutable-proptypes';
import React from 'react';

import MetricValue from 'in-components/MetricValue';

import 'in-components/KPIList/KPIList.less';


const rpt = React.PropTypes;
const block = 'in-kpi-list';

export default function KPIList({formatters, classname, metrics, labels, snapshot}) {
  const className = block + (classname ? ' ' + classname : '');

  return (
    <div className={className}>
      {metrics.map((metric, index) =>
        <span key={labels[index]}
              className={block + '__kpi'}>
            <MetricValue snapshotId={snapshot.get('id')}
                         metric={metric}
                         formatter={formatters[index]} />
        </span>
      )}
    </div>
  );
}

KPIList.propTypes = {
  formatters: rpt.array.isRequired,
  snapshot: irpt.map.isRequired,
  metrics: rpt.array.isRequired,
  labels: rpt.array.isRequired,
  classname: rpt.string
};
