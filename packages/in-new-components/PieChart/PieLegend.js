import rpt from 'prop-types';
import React from 'react';

import Legend from 'in-components/Chart/components/Legend';

export default function PieLegend({ hiddenMetrics, updateHiddenMetrics, y1, y2, reverseLegendOrder }) {
  return (
    <Legend
      y1={y1}
      y2={y2}
      y1Lables={getLabelsFromAxis(y1, hiddenMetrics, updateHiddenMetrics)}
      y2Lables={getLabelsFromAxis(y2, hiddenMetrics, updateHiddenMetrics, 'y2')}
      reverseLegendOrder={reverseLegendOrder}
    />
  );
}

PieLegend.propTypes = {
  hiddenMetrics: rpt.array, // should work even if the value is null/undefined
  updateHiddenMetrics: rpt.func.isRequired,
  y1: rpt.object.isRequired,
  y2: rpt.object,
  reverseLegendOrder: rpt.bool
};

/**
 * This function generates an array of LabelsMaps
 * It removes most of the unecessary fields Legends used to receive
 * Each label entry in the legends will represent each object in the return array
 * @return {Array}
 */
function getLabelsFromAxis(axis, list = [], updateList, axisName = 'y1') {
  return (
    axis?.labels?.map((label, i) => {
      const isToggleable =
        !axis.nonToggleableSeries ||
        !(axis.nonToggleableSeries.has(label) || axis.nonToggleableSeries.has(axis.metricIds[i]));
      return {
        name: label,
        dataSeriesName: `${axisName}-${i}`,
        isDisabled: list.includes(i),
        timeShift: axis.timeShifts && axis.timeShifts[i],
        isToggleable,
        metricId: axis.metricIds[i],
        onToggle: () => {
          if (isToggleable) {
            const index = list.indexOf(i);
            if (index > -1) {
              list.splice(index, 1);
            } else {
              list.push(i);
            }
            updateList([...list]); // force update
          }
        } // Toggle is for each label. For making the Legend not to pass any parameters, it's better to keep the function inside here
      };
    }) || []
  );
}
