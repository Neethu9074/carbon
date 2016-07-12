import irpt from 'react-immutable-proptypes';
import React from 'react';

import SparkChartsSection from 'in-components/sidebars/components/SparkChartsSection';
import {msTwoDecimalPlaces, twoDecimalPlaces} from 'in-services/formatters/number';


export default function LogicalHttpConnectionSidebar({snapshot}) {
  return (
    <div>
      <SparkChartsSection snapshot={snapshot}
                          metrics={[
                            {
                              metric: 'count',
                              label: 'calls/s',
                              formatter: twoDecimalPlaces
                            }, {
                              metric: 'duration.95th',
                              label: 'latency 95th',
                              formatter: msTwoDecimalPlaces
                            }, {
                              metric: 'error_count',
                              label: 'errors/s',
                              formatter: twoDecimalPlaces
                            }
                          ]} />
    </div>
  );
}

LogicalHttpConnectionSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
