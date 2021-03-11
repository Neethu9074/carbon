/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { compose, withProps } from 'recompose';
import { find, without } from 'lodash';

import MetricSelectorPresenter from 'in-analyze/components/MetricSelector/MetricSelectorPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export default compose(
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['availableMetrics', 'selectedMetrics', 'maximumNumberOfMetrics'],
        onReset: getInitialState
      }
    ],
    reducerName: 'onChange'
  }),
  withProps(({ onChange, newMetricForm, selectedMetricsForm, onSave, availableMetrics }) => ({
    onMetricChange: (metric, aggregation) =>
      onChange({
        newMetricForm: newMetricForm
          .updateIn(['metric'], f => f.setValue(metric).setTouched(true))
          .updateIn(['aggregation'], f => {
            return f.setValue(
              aggregation ? aggregation : getUnusedAggregation(metric, availableMetrics, selectedMetricsForm.value)
            );
          })
      }),
    onAggregationChange: v =>
      onChange({
        newMetricForm: newMetricForm.updateIn(['aggregation'], f => f.setValue(v).setTouched(true))
      }),
    onRemoveMetric: metric =>
      onChange({
        selectedMetricsForm: selectedMetricsForm.setValue(selectedMetricsForm.value.filter(m => m !== metric))
      }),
    onSwitchMetricPosition: (oldPosition, newPosition) => {
      const metrics = selectedMetricsForm.value.slice();
      metrics.splice(oldPosition, 1);
      metrics.splice(newPosition, 0, selectedMetricsForm.value[oldPosition]);
      onChange({
        selectedMetricsForm: selectedMetricsForm.setValue(metrics)
      });
    },
    onAddMetric: e => {
      stopPropagationAndPreventDefault(e);
      if (!newMetricForm.hierarchyValid) {
        onChange({
          newMetricForm: newMetricForm.setTouched(true, { recurse: true })
        });
        return;
      }

      const metric = newMetricForm.get('metric').value;
      const aggregation = newMetricForm.get('aggregation').value;
      onChange({
        newMetricForm: getEmptyNewForm(),
        selectedMetricsForm: selectedMetricsForm.setValue(
          selectedMetricsForm.value
            // avoid duplicates
            .filter(m => m.metric !== metric || m.aggregation !== aggregation)
            // add new metric
            .concat({
              metric,
              aggregation
            })
        )
      });
    },
    onClose: close,
    onSave: e => {
      stopPropagationAndPreventDefault(e);
      onSave(selectedMetricsForm.value);
      close();
    }
  }))
)(MetricSelectorPresenter);

function getInitialState({ selectedMetrics, maximumNumberOfMetrics }) {
  const newMetricForm = getEmptyNewForm();

  const selectedMetricsForm = createField({
    value: selectedMetrics,
    validator: metrics => {
      if (metrics.length > maximumNumberOfMetrics) {
        return [
          {
            severity: 'error',
            message: t('in-analyze:components.metricsSelector.pleaseSelectAtMostNumberOfmetrics', {
              maximumNumberOfMetrics: maximumNumberOfMetrics
            })
          }
        ];
      }
      return null;
    }
  }).setTouched(true);

  return {
    newMetricForm,
    selectedMetricsForm
  };
}

function getEmptyNewForm() {
  return createMapForm()
    .put(
      'metric',
      createField({
        value: '',
        validator: notBlankValidator
      })
    )
    .put(
      'aggregation',
      createField({
        value: '',
        validator: notBlankValidator
      })
    );
}

function getUnusedAggregation(metric, availableMetrics, selectedMetrics) {
  const definition = find(availableMetrics, m => m.metric === metric);
  const usedAggregations = selectedMetrics.filter(m => m.metric == metric).map(m => m.aggregation);
  const unusedAggregations = without.call(null, definition.supportedAggregations, ...usedAggregations);
  return unusedAggregations[0] || definition.supportedAggregations[0];
}
