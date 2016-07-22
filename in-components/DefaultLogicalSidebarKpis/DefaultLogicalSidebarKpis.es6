import React from 'react';

import SparkChartsSection from 'in-components/sidebars/components/SparkChartsSection';
import {msTwoDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';


export default function DefaultLogicalSidebarKpis({snapshot}) {
  return (
    <SparkChartsSection snapshot={snapshot}
                        metrics={[
                          {
                            metric: 'count',
                            label: 'calls/s',
                            formatter: zeroDecimalPlaces
                          }, {
                            metric: 'duration.mean',
                            label: 'avg. latency',
                            formatter: msTwoDecimalPlaces
                          }, {
                            metric: 'error_count',
                            label: 'errors/s',
                            formatter: zeroDecimalPlaces
                          }, {
                            metric: 'instances',
                            label: 'instances',
                            formatter: zeroDecimalPlaces
                          }
                        ]} />
  );
}
