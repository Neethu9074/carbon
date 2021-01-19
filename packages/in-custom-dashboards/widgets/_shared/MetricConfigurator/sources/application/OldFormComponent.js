/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { find, groupBy } from 'lodash';
import React from 'react';

import { onChangeGrouping } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TagFilterConfiguration from 'in-analyze/AnalyzeView/components/TagFilterConfiguration';
import TagGroupConfiguration from 'in-analyze/AnalyzeView/components/TagGroupConfiguration';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { availableMetrics } from 'in-applications/analyze/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import Stack from 'in-new-components/layout/Stack';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration,
  withGrouping = true
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');

  return (
    <Stack space="xsmall">
      <Sections>{dataSourceSection}</Sections>

      <TagFilterConfiguration
        tagFilters={form.get('tagFilters').value}
        onChange={tagFilters => onChange(['tagFilters'], f => f.setValue(tagFilters).setTouched(true))}
      />

      {withGrouping && (
        <TagGroupConfiguration
          tagFilters={form.get('tagFilters').value}
          grouping={form
            .get('grouping')
            ?.get(0)
            ?.toJS()}
          onChange={grouping => onChangeGrouping(onChange, grouping)}
        />
      )}

      <Sections>
        <SelectInSection
          label="Metric"
          id="metic-configurator-application-metric"
          value={metricField.value}
          onChange={e =>
            onChange([], form =>
              form
                .updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                .updateIn(['aggregation'], field => {
                  const aggregations = getAggregations(e.target.value);
                  return field.setValue(aggregations.length > 1 ? '' : aggregations[0]);
                })
            )
          }
          hasError={!metricField.valid && metricField.touched}
          additionalContent={<TouchedMessages field={metricField} />}
        >
          {
            <>
              <option value="">Please select</option>
              {Object.entries(groupBy(availableMetrics, ({ category }) => category || ''))
                .sort((a, b) => compareIgnoreCase(a.category, b.category))
                .map(([category, metrics]) => {
                  const options = metrics.map(({ metric, label }) => (
                    <option key={metric} value={metric}>
                      {label}
                    </option>
                  ));

                  if (!category) {
                    return options;
                  }

                  return (
                    <optgroup key={category} label={category}>
                      {options}
                    </optgroup>
                  );
                })}
            </>
          }
        </SelectInSection>
      </Sections>

      <Sections>
        <SelectInSection
          label="Aggregation"
          id="metic-configurator-application-aggregation"
          value={aggregationField.value}
          onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!aggregationField.valid && aggregationField.touched}
          disabled={!metricField.valid}
          additionalContent={<TouchedMessages field={metricField} />}
        >
          {!metricField.valid && <option value="">Please select a metric</option>}
          {metricField.valid && (
            <>
              <option value="">Please select</option>
              {getAggregations(metricField.value).map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </SelectInSection>
      </Sections>

      {formatterSection}

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}

function getAggregations(metric) {
  return find(availableMetrics, ({ metric: m }) => m === metric)?.supportedAggregations ?? [];
}
