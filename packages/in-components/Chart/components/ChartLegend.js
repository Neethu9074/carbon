/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import rpt from 'prop-types';
import React from 'react';

import Legend from 'in-components/Chart/components/Legend';

export default function ChartLegend({ chart }) {
  const filteredDataSeries = useObservable(chart.config.filteredDataSeries$, [chart.config.filteredDataSeries$], {
    pure: false
  });
  const y1Lables = getLabelsMapFromAxis(chart.config.y1, filteredDataSeries, chart);
  const y2Lables = getLabelsMapFromAxis(chart.config.y2, filteredDataSeries, chart, 'y2');
  return (
    <Legend
      reverseLegendOrder={chart.config.reverseLegendOrder}
      y1={chart.config.y1}
      y2={chart.config.y2}
      y1Lables={y1Lables}
      y2Lables={y2Lables}
    />
  );
}

ChartLegend.propTypes = {
  chart: rpt.object.isRequired
};

/**
 * This function generates an array of LabelsMaps
 * It removes most of the unecessary fields Legends used to receive
 * Each label entry in the legends will represent each object in the return array
 * @param {Object} axis
 * @param {Set} filteredDataSeries
 * @param {Object} chart
 * @param {String} axisName
 */
function getLabelsMapFromAxis(axis, filteredDataSeries, chart, axisName = 'y1') {
  return (
    axis?.labels?.map((label, i) => {
      const isToggleable =
        !axis.nonToggleableSeries ||
        !(axis.nonToggleableSeries.has(label) || axis.nonToggleableSeries.has(axis.metricIds[i]));
      return {
        name: label,
        dataSeriesName: `${axisName}-${i}`,
        isDisabled: filteredDataSeries?.has(`${axisName}-${i}`),
        timeShift: axis.timeShifts && axis.timeShifts[i],
        isToggleable,
        metricId: axis.metricIds[i],
        onToggle: () => {
          if (isToggleable) {
            chart.config.toggleDataSeries(`${axisName}-${i}`);
            chart.renderScheduler.forceRender();
          }
        } // Toggle is for each label. For making the Legend not to pass any parameters, it's better to keep the function inside here
      };
    }) || []
  );
}
