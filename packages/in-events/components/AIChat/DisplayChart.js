/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useRef, useState } from 'react';
import { SimpleBarChart } from '@carbon/charts-react';

import { CarbonButton } from '@instana/components';

import locals from './DisplayChart.mless';

const DisplayChart = ({ messageItem }) => {
  const [showVisualization, setShowVisualization] = useState(false);

  const chartRef = useRef(null);

  const handleToggle = () => {
    setShowVisualization(true);
  };

  useEffect(() => {
    if (showVisualization && chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showVisualization]);

  return (
    <div>
      {!showVisualization && (
        <CarbonButton kind={'tertiary'} className={locals.buttonStyle} size={'sm'} onClick={handleToggle}>
          {'Show visualization'}
        </CarbonButton>
      )}
      {showVisualization && (
        <div ref={chartRef}>
          <SimpleBarChart
            data={messageItem.user_defined.chart_data.data}
            options={messageItem.user_defined.chart_data.options}
          />
        </div>
      )}
    </div>
  );
};

export default DisplayChart;
