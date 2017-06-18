import React from 'react';

import statistics from 'in-map/stores/statisticsStore';
import Collapsible from 'in-components/Collapsible';
import connectTo from 'in-hoc/connectTo';

import './MapStatistics.less';

const block = 'in-dev-panel-map-stats';

export default connectTo(
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
          <Collapsible key={key} initiallyOpen>
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
