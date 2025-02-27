/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Tooltip } from '@instana/components';

import { getShouldRenderLabel } from 'in-components/Chart/components/GetShouldRenderLabel';
import Legend from 'in-components/Chart/components/Legend';
import { t } from 'in-i18n';

export default function ChartLegend({ chart, onLegendItemToggle, facets, formModel }) {
  const filteredDataSeries = useObservable(chart.config.filteredDataSeries$, [chart.config.filteredDataSeries$], {
    pure: false
  });

  const y1Labels = getLabelsMapFromAxis(
    chart.config.y1,
    filteredDataSeries,
    chart,
    'y1',
    onLegendItemToggle,
    facets,
    formModel
  );
  const y2Labels = getLabelsMapFromAxis(
    chart.config.y2,
    filteredDataSeries,
    chart,
    'y2',
    onLegendItemToggle,
    facets,
    formModel
  );

  return (
    <>
      <Legend
        reverseLegendOrder={chart.config.reverseLegendOrder}
        y1={chart.config.y1}
        y2={chart.config.y2}
        y1Labels={y1Labels}
        y2Labels={y2Labels}
      />
    </>
  );
}

ChartLegend.propTypes = {
  chart: rpt.object.isRequired,
  onLegendItemToggle: rpt.func,
  facets: rpt.object,
  formModel: rpt.array
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
 * @param {Object} facets
 * @param {Object[]} formModel
 */
function getLabelsMapFromAxis(
  axis,
  filteredDataSeries,
  chart,
  axisName = 'y1',
  onToggle = () => {},
  facets,
  formModel
) {
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

      const shouldRenderLabel = getShouldRenderLabel(formModel, facets, axis, i);

      return {
        name: showLegendToolTip,
        renderLabel: shouldRenderLabel,
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
