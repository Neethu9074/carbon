import React from 'react';

import ButtonGroup from 'in-new-components/ButtonGroup';

import locals from './UpstreamDownstreamMetric.mless';

export default function UpstreamDownstreamMetric({ metrics, selectedMetric, onChangeMetric }) {
  return (
    <div className={locals.wrapper}>
      <ButtonGroup
        buttonPropsList={metrics.map(metric => ({
          text: metric.text,
          key: metric.key,
          icon: metric.icon,
          kind: metric.key === selectedMetric ? 'primaryv2' : 'secondary',
          onClick: () => {
            onChangeMetric(metric.key);
          },
          size: 'compact'
        }))}
        activeKey={selectedMetric}
      />
    </div>
  );
}
