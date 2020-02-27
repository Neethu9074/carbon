import React from 'react';

import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';
import LightCard from 'in-new-components/Card/LightCard';

import locals from './Widget.mless';

export default function EventChartCardWidget({ config }) {
  return (
    <LightCard
      className={locals.card}
      headerClassName={locals.header}
      title="Events"
      icon="lib_events_inverted"
      useMaxAvailableHeight
    >
      <ChartWidget config={config} />
    </LightCard>
  );
}
