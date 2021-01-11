import React, { useMemo, useState } from 'react';

import { enrichAxisWithColors } from 'in-components/Chart/strokeColors';
import getElementDimensions from 'in-hoc/getElementDimensions';
import PieLegend from 'in-new-components/PieChart/PieLegend';
import { percentage } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';

import locals from './PieChart.mless';

const defaultChartHeight = 182;
export default function PieChart({ config }) {
  if (config.automaticallySize) {
    return <PieChartWrapper {...config} />;
  }
  return <CustomSized {...config} />;
}

const CustomSized = getElementDimensions(function CustomSizedChart(props) {
  return <PieChartWrapper {...props} width={props.width} height={props.customHeight || defaultChartHeight} />;
});

// This component is not doing much otherthan rendering the chart, We can keep in the same file
const PieChartWrapper = props => {
  enrichAxisWithColors(props.y1);
  const {
    y1: { metrics, formatter }
  } = props;
  const [hiddenMetrics, setHiddenMetrics] = useState([]);

  const sum = useMemo(
    () => metrics.filter((_, i) => !hiddenMetrics.includes(i)).reduce((acc, m2) => acc + m2[0][1], 0),
    [metrics, hiddenMetrics]
  );

  const slices = useMemo(
    () =>
      metrics.map((eachMetric, i) => {
        if (!hiddenMetrics.includes(i)) {
          return {
            percentage: eachMetric[0][1] / sum,
            value: eachMetric[0][1],
            color: props.y1.colors100[i],
            hoverColor: props.y1.colors50[i]
          };
        }
      }),
    [metrics, props.y1.colors100, props.y1.colors50, hiddenMetrics]
  );

  let renderedPercentage = 0;
  const customStyle = !props.automaticallySize
    ? {
        height: props.height,
        width: props.width,
        maxHeight: props.height
      }
    : {};
  return (
    <div className={locals.chartContainer}>
      <PieLegend {...props} updateHiddenMetrics={setHiddenMetrics} hiddenMetrics={hiddenMetrics} />
      <div className={locals.chart} style={customStyle}>
        <svg className={locals.svg} viewBox="-1 -1 2 2">
          {slices.map((slice, i) => {
            if (!slice) return null;
            // destructuring assignment sets the two variables at once
            const [startX, startY] = getCoordinatesForSlice(renderedPercentage);

            // each slice starts where the last slice ended, so keep a cumulative percent
            renderedPercentage += slice.percentage;

            const [endX, endY] = getCoordinatesForSlice(renderedPercentage);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percentage > 0.5 ? 1 : 0;

            // Path for each sector
            const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
            return (
              <Tooltip
                key={i}
                content={`${formatter(slice.value)} (${percentage.detailed(slice.percentage)})`}
                align="mousePosition"
              >
                <path d={pathData} fill={slice.color} />
              </Tooltip>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

function getCoordinatesForSlice(percentage) {
  const x = Math.cos(2 * Math.PI * percentage);
  const y = Math.sin(2 * Math.PI * percentage);
  return [x, y];
}
