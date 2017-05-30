import React from 'react';

import Control from 'in-components/MapOverlayControls/components/Control';
import statistics from 'in-map/stores/statisticsStore';
import Collapsible from 'in-components/Collapsible';
import connectTo from 'in-hoc/connectTo';

import 'in-components/MapOverlayControls/components/MapStatistics.less';

export default function MapStatistics() {
  return (
    <Control
      createMenuContent={createMenuContent}
      tooltipText="Map statistics. DEV ONLY FEATURE."
      type="dot"
      id="mapstatistics"
    />
  );
}

function createMenuContent() {
  return <Statistics />;
}

const block = 'in-sidebar-map-stats';

const Statistics = connectTo(
  {
    _statistics: statistics.stream.throttle(1000)
  },
  function StatisticsList({ _statistics }) {
    if (!_statistics) {
      return null;
    }
    const components = [];
    _statistics.forEach((statistic, key) => {
      if (typeof statistic === 'string' || typeof statistic === 'number') {
        components.push(<KeyValue key={key} name={key} value={statistic} />);
      } else {
        components.push(
          <Collapsible key={key}>
            <Collapsible.Header>
              {key}
            </Collapsible.Header>
            <Collapsible.Content>
              <StatisticsList _statistics={statistic} />
            </Collapsible.Content>
          </Collapsible>
        );
      }
    });

    return (
      <div className={block}>
        {components}
      </div>
    );
  }
);

function KeyValue({ name, value }) {
  return (
    <div className={block + '__key-value'}>
      <span>
        {name}
      </span>
      <span>
        {value}
      </span>
    </div>
  );
}
