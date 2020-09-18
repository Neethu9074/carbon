import React, { useState } from 'react';

import { ComboChartMetricSelector } from 'in-applications/Dashboards/commonComponents/ChartSelectors';
import CallsErrorsChart from 'in-applications/Dashboards/commonComponents/CallsErrorsChart';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import Card from 'in-new-components/Card';

const metrics = [
  {
    label: 'Calls',
    value: 'calls'
  },
  {
    label: 'Erroneous Calls',
    value: 'erroneousCalls'
  }
];

export default function CallsErrors(props) {
  const { cardTitle } = props;
  const [activeMetric, setActiveMetric] = useState(metrics[0].value);
  const timeShiftConfig = useTimeShiftConfig();

  const header = timeShiftConfig.offset && (
    <ComboChartMetricSelector metrics={metrics} selected={activeMetric} onChange={setActiveMetric} />
  );

  return (
    <Card title={cardTitle} header={header}>
      <CallsErrorsChart
        {...props}
        cardTitle={undefined}
        timeShiftConfig={timeShiftConfig}
        timeShiftMetric={timeShiftConfig.offset ? activeMetric : null}
      />
    </Card>
  );
}
