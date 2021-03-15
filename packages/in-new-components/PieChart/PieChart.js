/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';
import rpt from 'prop-types';

import { enrichAxisWithColors } from 'in-components/Chart/strokeColors';
import TooltipContent from 'in-new-components/PieChart/TooltipContent';
import getElementDimensions from 'in-hoc/getElementDimensions';
import PieLegend from 'in-new-components/PieChart/PieLegend';
import { defaultTimeShift } from 'in-stores/time/shifting';
import Tooltip from 'in-components/Tooltip';

import locals from './PieChart.mless';

const defaultChartHeight = 182;
export default function PieChart({ config, donutRadius }) {
  if (config.automaticallySize) {
    return <PieChartWrapper {...config} donutRadius={donutRadius} />;
  }
  return <CustomSized {...config} donutRadius={donutRadius} />;
}

const CustomSized = getElementDimensions(function CustomSizedChart(props) {
  return <PieChartWrapper {...props} width={props.width} height={props.customHeight || defaultChartHeight} />;
});

// This component is not doing much otherthan rendering the chart, We can keep in the same file
const PieChartWrapper = props => {
  enrichAxisWithColors(props.y1);
  const {
    y1: { metrics, formatter },
    donutRadius
  } = props;
  const [hiddenMetrics, setHiddenMetrics] = useState([]);
  const sliceGap = donutRadius && metrics.length > 1 ? 0.002 : 0;

  const sum =
    useMemo(() => metrics.filter((_, i) => !hiddenMetrics.includes(i)).reduce((acc, m2) => acc + m2[0][1], 0), [
      metrics,
      hiddenMetrics
    ]) +
    metrics.length * sliceGap;

  const slices = useMemo(
    () =>
      metrics.map((eachMetric, i) => {
        if (!hiddenMetrics.includes(i)) {
          return {
            percentage: eachMetric[0][1] / sum,
            value: eachMetric[0][1],
            color: props.y1.colors100[i],
            hoverColor: props.y1.colors50[i],
            label: props.y1.labels[i],
            aggregation: props.y1.aggregations?.[i],
            timeShift: props.y1.timeShifts?.[i] || defaultTimeShift
          };
        }
      }),
    [metrics, props.y1.colors100, props.y1.colors50, hiddenMetrics, sum]
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
            const [startX, startY] = getCoordinatesForSlice(renderedPercentage + sliceGap);

            // each slice starts where the last slice ended, so keep a cumulative percent
            renderedPercentage += slice.percentage;

            const [endX, endY] = getCoordinatesForSlice(renderedPercentage);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percentage > 0.5 ? 1 : 0;

            // Path for each sector
            const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
            return (
              <Tooltip
                themeStyle="light"
                key={i}
                content={<TooltipContent slice={slice} formatter={formatter} />}
                align="mousePosition"
              >
                <path d={pathData} fill={slice.color} />
              </Tooltip>
            );
          })}

          {donutRadius && <circle cx="0" cy="0" r={donutRadius} fill="#fff" />}
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

PieChart.propTypes = {
  config: rpt.object.isRequired,
  donutRadius: rpt.number
};

PieChart.defaultProps = {
  donutRadius: 0.5
};
