import React from 'react';

import {
  msZeroDecimalPlaces,
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';

import KPIList from 'in-components/KPIList';


export default function dummyKPI({snapshot}) {
  return (
    <KPIList snapshot={snapshot}
             metrics={[
               'METRIC_NAME_HERE',
               'METRIC_NAME_HERE',
               'errors',
               'sessions'
             ]}
             labels={[
               'calls/s',
               'latency',
               'errors',
               'sessions'
             ]}
             formatters={[
               zeroDecimalPlaces,
               msZeroDecimalPlaces,
               percentageTwoDecimalPlaces,
               zeroDecimalPlaces
             ]}/>
  );
}
