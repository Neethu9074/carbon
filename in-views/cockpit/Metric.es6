import React from 'react';

import 'in-views/cockpit/Metric.less';

const block = 'in-cockpit-metric';

export default function Cockpit({ metric }) {
  return (
    <div className={block}>
      <div className={`${block}__key`}>
        {metric}
      </div>
      :
      <div className={`${block}__value`}>
        12.5
      </div>
    </div>
  );
}
