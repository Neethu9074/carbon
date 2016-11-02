import React from 'react';

import Control from 'in-components/Controls/components/Control';
import statistics from 'in-map/stores/statisticsStore';
import Collapsible from 'in-components/Collapsible';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/components/MapStatistics.less';


export default function MapStatistics() {
  return (
    <Control createMenuContent={createMenuContent}
             tooltipText='Map statistics. DEV ONLY FEATURE.'
             type='dot'
             id='mapstatistics' />
  );
}

function createMenuContent() {
  return (
    <Statistics />
  );
}


const block = 'in-sidebar-map-stats';

const Statistics = connectTo({
  _statistics: statistics.stream.throttle(1000)
},
function StatisticsList({_statistics}) {
  if (!_statistics) {
    return null;
  }

  const keys = Object.keys(_statistics);
  return (
    <div className={block}>
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
              <StatisticsList _statistics={statistic} />
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
