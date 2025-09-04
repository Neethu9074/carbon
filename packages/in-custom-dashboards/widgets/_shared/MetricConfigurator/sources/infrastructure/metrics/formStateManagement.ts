/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import { escapeRegExp } from 'lodash';

import { MetricInCatalog } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/getMetricInCatalog';
// @ts-expect-error needs to be converted to ts
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import { getCrossSeriesAggregation, parseAggregation } from 'in-infrastructure/util/aggregation';

export interface Node {
  metric: string;
  levelType: string;
  allowedCrossSeriesAggregations: string[];
  label: string;
  parentLabels: string[];
}

interface BindProps {
  onChange: OnChangeForm;
  metricDefaultFormatter: string;
}

type OnChangeForm = (path: string[], form: (form: MapForm<any>) => MapForm<any>) => void;

export function formCallbacks({ onChange, metricDefaultFormatter }: BindProps) {
  return {
    onMetricChange({ metric, levelType, allowedCrossSeriesAggregations, label, parentLabels }: Node) {
      onChange([], form => {
        const aggregation = parseAggregation(form.getIn(['aggregation']).value, 'MEAN', allowedCrossSeriesAggregations);
        let f = form
          .updateIn(['metric'], field => field.setValue(metric).setTouched(true))
          .updateIn(['type'], field => field.setValue(levelType).setTouched(true))
          .updateIn(['metricPath'], field => field.setValue(parentLabels).setTouched(true))
          .updateIn(['aggregation'], field => field.setValue(aggregation.timeAggregation).setTouched(true))
          .updateIn(['crossSeriesAggregation'], field =>
            field.setValue(getCrossSeriesAggregation(aggregation)).setTouched(true)
          )
          .updateIn(['allowedCrossSeriesAggregations'], field =>
            field.setValue(allowedCrossSeriesAggregations).setTouched(true)
          );
        if (f.containsKey('metricLabel')) {
          f = f.updateIn(['metricLabel'], field => field.setValue(label).setTouched(true));
        }
        if (f.containsKey('formatter')) {
          f = f.updateIn(['formatter'], field => field.setValue(metricDefaultFormatter).setTouched(true));
        }
        return f;
      });
    },

    setIsRegex(isRegex: boolean) {
      onChange([], form => {
        const toPlain = !isRegex && form.get('regex').value;
        const toRegex = isRegex && !form.get('regex').value;
        if (toPlain) {
          form = form
            .updateIn(['metric'], field => field.setValue(undefined).setTouched(false))
            .updateIn(['metricPath'], field => field.setValue(undefined).setTouched(false));

          if (form.containsKey('metricLabel')) {
            form = form.updateIn(['metricLabel'], field => field.setValue(undefined).setTouched(false));
          }
        } else if (toRegex) {
          const regex = escapeRegExp(form.get('metric').value);
          form = form
            .updateIn(['metric'], field => field.setValue(regex))
            .updateIn(['metricPath'], field => field.setValue(getPathForRegex(regex)).setTouched(false))
            .updateIn(['formatter'], field => field.setValue(metricDefaultFormatter).setTouched(true));

          if (form.containsKey('metricLabel')) {
            form = form.updateIn(['metricLabel'], field => field.setValue(getLabelForRegex(regex)).setTouched(true));
          }
        }
        return form.updateIn(['regex'], field => field.setValue(isRegex).setTouched(true));
      });
    },

    onRegexChange(regex: string) {
      onChange([], form => {
        const isRegex = form.get('regex').value;
        if (isRegex) {
          form = form
            .updateIn(['metric'], field => field.setValue(regex).setTouched(true))
            .updateIn(['metricPath'], field => field.setValue(getPathForRegex(regex)).setTouched(true))
            .updateIn(['formatter'], field => field.setValue(metricDefaultFormatter).setTouched(true));

          if (form.containsKey('metricLabel')) {
            form = form.updateIn(['metricLabel'], field => field.setValue(getLabelForRegex(regex)).setTouched(true));
          }
        }

        return form;
      });
    },

    setMetadata(metadata: MetricInCatalog) {
      onChange([], form => {
        var f = form.updateIn(['metricPath'], field => field.setValue(metadata.path).setTouched(true));
        if (f.containsKey('metricLabel')) {
          f = f.updateIn(['metricLabel'], field => field.setValue(metadata.label).setTouched(true));
        }
        if (f.containsKey('formatter')) {
          f = f.updateIn(['formatter'], field => field.setValue(metricDefaultFormatter).setTouched(true));
        }
        return f;
      });
    },

    setAggregation(timeAggregation: string) {
      onChange([], form => {
        const aggregation = parseAggregation(
          timeAggregation,
          form.getIn(['crossSeriesAggregation']).value,
          form.getIn(['allowedCrossSeriesAggregations']).value
        );
        return form
          .updateIn(['aggregation'], field => field.setValue(aggregation.timeAggregation).setTouched(true))
          .updateIn(['crossSeriesAggregation'], field =>
            field.setValue(getCrossSeriesAggregation(aggregation)).setTouched(true)
          );
      });
    },

    setUnit(unit: string) {
      onChange([], form => form.updateIn(['unit'], field => field.setValue(unit).setTouched(true)));
    },

    setIsSumCrossSeriesAggregation(isSumCrossSeriesAggregation: boolean) {
      onChange([], form => {
        const crossSeriesAggregation = isSumCrossSeriesAggregation ? 'SUM' : 'MEAN';
        const aggregation = parseAggregation(
          form.getIn(['aggregation']).value,
          crossSeriesAggregation,
          form.getIn(['allowedCrossSeriesAggregations']).value,
          true
        );
        return form.updateIn(['crossSeriesAggregation'], field =>
          field.setValue(getCrossSeriesAggregation(aggregation)).setTouched(true)
        );
      });
    },

    setIsLastValue(isLastValueChecked: boolean) {
      onChange([], form => {
        return form.updateIn(['lastValue'], field => field.setValue(isLastValueChecked).setTouched(true));
      });
    },

    onTypeChange(type: string) {
      onChange([], form => form.updateIn(['type'], field => field.setValue(type).setTouched(true)));
    }
  };
}

export function getLabelForRegex(regex?: string) {
  return regex ?? '/' + regex + '/';
}

export function getPathForRegex(regex?: string) {
  return regex ? ['Others', 'Regex'] : [];
}
