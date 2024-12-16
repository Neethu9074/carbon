/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Tooltip } from '@instana/components';

import Legend from 'in-components/Chart/components/Legend';
import { t } from 'in-i18n';

export default function ChartLegend({ chart, onLegendItemToggle }) {
  const filteredDataSeries = useObservable(chart.config.filteredDataSeries$, [chart.config.filteredDataSeries$], {
    pure: false
  });
  const y1Lables = getLabelsMapFromAxis(chart.config.y1, filteredDataSeries, chart, 'y1', onLegendItemToggle);
  const y2Lables = getLabelsMapFromAxis(chart.config.y2, filteredDataSeries, chart, 'y2', onLegendItemToggle);
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
  chart: rpt.object.isRequired,
  onLegendItemToggle: rpt.func
};

/**
 * This function generates an array of LabelsMaps
 * It removes most of the unecessary fields Legends used to receive
 * Each label entry in the legends will represent each object in the return array
 * The function also filters the items passed in excludedLabelsFromLegend array, to not to display as legends, and display only in tooltip.
 * @param {Object} axis
 * @param {Set} filteredDataSeries
 * @param {Object} chart
 * @param {String} axisName
 * @param {Function} onToggle
 */
function getLabelsMapFromAxis(axis, filteredDataSeries, chart, axisName = 'y1', onToggle = () => {}) {
  const axisLabels =
    axis?.excludedLabelsFromLegend?.length > 0
      ? axis.labels.filter(label => axis.excludedLabelsFromLegend.indexOf(label) == -1)
      : axis?.labels;

  return (
    axisLabels?.map((label, i) => {
      const isToggleable =
        !axis.nonToggleableSeries ||
        !(axis.nonToggleableSeries.has(label) || axis.nonToggleableSeries.has(axis.metricIds[i]));
      const showLegendToolTip =
        label === '-' ? (
          <Tooltip content={t('in-components:analyze.groupNameNotAvailable')}>
            <span>{label}</span>
          </Tooltip>
        ) : (
          label
        );
      return {
        name: showLegendToolTip,
        dataSeriesName: `${axisName}-${i}`,
        isDisabled: filteredDataSeries?.has(`${axisName}-${i}`),
        timeShift: axis.timeShifts && axis.timeShifts[i],
        isToggleable,
        metricId: axis.metricIds[i],
        onToggle: () => {
          if (isToggleable) {
            onToggle(chart.config, axisLabels[i]);
            chart.config.toggleDataSeries(`${axisName}-${i}`);
            chart.renderScheduler.forceRender();
          }
        } // Toggle is for each label. For making the Legend not to pass any parameters, it's better to keep the function inside here
      };
    }) || []
  );
}
