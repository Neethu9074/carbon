import React from 'react';

import statistics from 'in-map/stores/statisticsStore';
import Collapsible from 'in-components/Collapsible';
import connectTo from 'in-hoc/connectTo';

import 'in-components/RightSidebar/components/MapStatistics/MapStatistics.less';


const block = 'in-sidebar-map-stats';

export default connectTo({
  _statistics: statistics.stream.throttle(1000).map(stats => stats.objects)
},
function MapStatistics({_statistics}) {
  if (!_statistics) {
    return null;
  }

  const keys = Object.keys(_statistics);
  return (
    <div>
      {keys.map(key => {
        const statistic = _statistics[key];
        if (typeof statistic === 'string' ||
            typeof statistic === 'number') {
          return (
            <KeyValue key={key}
                      name={key}
                      value={statistic} />
          );
        }

        return (
          <Collapsible key={key}>
            <Collapsible.Header>
              {key}
            </Collapsible.Header>
            <Collapsible.Content>
              <MapStatistics _statistics={statistic} />
            </Collapsible.Content>
          </Collapsible>
        );
      })}
    </div>
  );
});

function KeyValue({name, value}) {
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
