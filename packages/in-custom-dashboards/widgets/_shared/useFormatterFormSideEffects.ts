/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, Item, ListForm, MapForm } from 'formalistic';

import { MetricSource } from '@instana/types/typeDefinitions';
import { AggregationType } from '@instana/types';

import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import { defaultFormatter } from 'in-stores/metric/formatters';

export const y1AxisPath = 'y1';
export const y2AxisPath = 'y2';
export const metricConfigurationPath = 'metricConfiguration';
export const metricsPath = 'metrics';
export const sourcePath = 'source';
export const metricPath = 'metric';
export const aggregationPath = 'aggregation';
export const formatterPath = 'formatter';

const formSideEffects = [
  {
    path: [metricConfigurationPath, sourcePath],
    effects: [handleFormatterUpdate as EffectFunction]
  },
  {
    path: [metricConfigurationPath, metricPath],
    effects: [handleFormatterUpdate as EffectFunction]
  },
  {
    path: [metricConfigurationPath, aggregationPath],
    effects: [handleFormatterUpdate as EffectFunction]
  }
];
const chartFormSideEffects = [
  {
    path: [y1AxisPath, metricsPath, /\d+/, sourcePath],
    effects: [handleChartAxisFormatterUpdate(y1AxisPath) as EffectFunction]
  },
  {
    path: [y1AxisPath, metricsPath, /\d+/, metricPath],
    effects: [handleChartAxisFormatterUpdate(y1AxisPath) as EffectFunction]
  },
  {
    path: [y1AxisPath, metricsPath, /\d+/, aggregationPath],
    effects: [handleChartAxisFormatterUpdate(y1AxisPath) as EffectFunction]
  },
  {
    path: [y1AxisPath, metricsPath, /\d+/],
    effects: [handleChartAxisFormatterUpdate(y1AxisPath) as EffectFunction]
  },
  {
    path: [y2AxisPath, metricsPath, /\d+/, sourcePath],
    effects: [handleChartAxisFormatterUpdate(y2AxisPath) as EffectFunction]
  },
  {
    path: [y2AxisPath, metricsPath, /\d+/, metricPath],
    effects: [handleChartAxisFormatterUpdate(y2AxisPath) as EffectFunction]
  },
  {
    path: [y2AxisPath, metricsPath, /\d+/, aggregationPath],
    effects: [handleChartAxisFormatterUpdate(y2AxisPath) as EffectFunction]
  },
  {
    path: [y2AxisPath, metricsPath, /\d+/],
    effects: [handleChartAxisFormatterUpdate(y2AxisPath) as EffectFunction]
  }
];
const chartFormDragSideEffects = [
  {
    path: [y1AxisPath, metricsPath],
    effects: [handleChartAxisFormatterUpdate(y1AxisPath) as EffectFunction]
  },
  {
    path: [y2AxisPath, metricsPath],
    effects: [handleChartAxisFormatterUpdate(y2AxisPath) as EffectFunction]
  }
];

interface MetricConfig {
  source: MetricSource;
  metric: string;
  aggregation: AggregationType;
}

function handleFormatterUpdate(form: MapForm<any>): Item {
  const metricConfig = form.get(metricConfigurationPath) as MapForm<any>;
  const sourceField = metricConfig.get(sourcePath) as Field<MetricSource>;
  const metricField = metricConfig.get(metricPath) as Field<string>;
  const aggregationField = metricConfig.get(aggregationPath) as Field<AggregationType>;

  const source = sourceField?.value;
  const metric = metricField?.value;
  const aggregation = aggregationField?.value;
  const formatters = getFormatter(source, metric, aggregation);

  const previousFormatter = form.get('formatter')?.value;

  for (let formatter of formatters) {
    if (previousFormatter === formatter.id) {
      return form;
    }
  }

  return form.updateIn([formatterPath], f =>
    (f as Field<string>).setValue(formatters?.[0].id ?? defaultFormatter).setTouched(true)
  );
}

function handleChartAxisFormatterUpdate(axisName: 'y1' | 'y2') {
  return (form: MapForm<any>): Item => {
    const axis = form.get(axisName) as MapForm<any>;

    const metricsForAxis = axis.get(metricsPath) as ListForm<any>;
    const metricConfigurations = metricsForAxis?.map((metricList): MetricConfig => {
      const sourceField = (metricList as MapForm<any>).get(sourcePath);
      const source = (sourceField as Field<MetricSource>)?.value;
      const metricField = (metricList as MapForm<any>).get(metricPath);
      const metric = (metricField as Field<string>)?.value;
      const aggregationField = (metricList as MapForm<any>).get(aggregationPath);
      const aggregation = (aggregationField as Field<AggregationType>)?.value;

      return {
        source,
        metric,
        aggregation
      };
    });

    const previousFormatter = axis.get('formatter')?.value;

    const formatters =
      metricConfigurations?.flatMap(config => getFormatter(config.source, config.metric, config.aggregation)) ?? [];

    for (let formatter of formatters) {
      if (previousFormatter === formatter.id) {
        return form;
      }
    }

    return form.updateIn([axisName, formatterPath], f =>
      (f as Field<string>).setValue(formatters?.[0]?.id ?? defaultFormatter.id).setTouched(true)
    );
  };
}

export function useFormatterFormSideEffects(
  form: Item,
  setForm: (field: Item) => void
): ReturnType<typeof useFormSideEffects> {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE]
  });
}

export function useChartFormatterFormSideEffects(
  form: Item,
  setForm: (field: Item) => void
): ReturnType<typeof useFormSideEffects> {
  return useFormSideEffects({
    form,
    setForm,
    effects: chartFormSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE]
  });
}

export function useChartFormatterDragAndDropFormSideEffects(
  form: Item,
  setForm: (field: Item) => void
): ReturnType<typeof useFormSideEffects> {
  return useFormSideEffects({
    form,
    setForm,
    effects: chartFormDragSideEffects
  });
}
