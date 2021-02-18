/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { find, groupBy } from 'lodash';
import React from 'react';

import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { availableMetrics } from 'in-websites/analyze/AnalyzeView/metrics';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import * as queryBuildersPerDataSource from 'in-websites/queryBuilder';
import { emptyObject, pendingResult } from 'in-services/fixedObjects';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import { dataSourceTitles } from 'in-websites/tags';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration
}) {
  const beaconTypeField = form.get('beaconType');
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const { QueryBuilder, getTagCatalog } = queryBuildersPerDataSource[beaconTypeField.value] || emptyObject;
  const aggregators = getAggregations(beaconTypeField.value, metricField.value);
  const isSingleAggregator = aggregators?.length < 2;

  const tagCatalogResult = useObservable(getTagCatalog, [beaconTypeField.value]) ?? pendingResult;
  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult,
    form,
    onChange
  });

  return (
    <Stack space="xsmall">
      <Sections>
        {dataSourceSection}
        <SelectInSection
          label="Beacon Type"
          id="metic-configurator-website-beacon-type"
          value={beaconTypeField.value}
          onChange={e =>
            onChange([], form =>
              form
                .updateIn(['beaconType'], field => field.setValue(e.target.value).setTouched(true))
                .updateIn(['metric'], field => field.setValue(''))
                .updateIn(['aggregation'], field => field.setValue(''))
            )
          }
          hasError={!beaconTypeField.valid && beaconTypeField.touched}
          additionalContent={<TouchedMessages field={beaconTypeField} />}
          useAlternateBg
        >
          <option value="">Please select</option>
          {Object.keys(dataSourceTitles)
            .sort((a, b) => compareIgnoreCase(dataSourceTitles[a], dataSourceTitles[b]))
            .map(key => (
              <option key={key} value={key}>
                {dataSourceTitles[key]}
              </option>
            ))}
        </SelectInSection>
      </Sections>
      <Sections>
        <SelectInSection
          label="Metric"
          id="metic-configurator-website-metric"
          value={metricField.value}
          onChange={e =>
            onChange([], form =>
              form
                .updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                .updateIn(['aggregation'], field => {
                  const aggregations = getAggregations(beaconTypeField.value, e.target.value);
                  return field.setValue(aggregations.length > 1 ? '' : aggregations[0]);
                })
            )
          }
          hasError={!metricField.valid && metricField.touched}
          disabled={!beaconTypeField.valid}
          additionalContent={<TouchedMessages field={metricField} />}
        >
          {!beaconTypeField.valid && <option value="">Please select a data source</option>}
          {beaconTypeField.valid && (
            <>
              <option value="">Please select</option>
              {Object.entries(groupBy(availableMetrics[beaconTypeField.value], ({ category }) => category || ''))
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
          )}
        </SelectInSection>
        <SelectInSection
          label="Aggregation"
          id="metic-configurator-website-aggregation"
          value={aggregationField.value}
          onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!aggregationField.valid && aggregationField.touched}
          disabled={!metricField.valid || isSingleAggregator}
          additionalContent={<TouchedMessages field={aggregationField} />}
          useAlternateBg
        >
          {!metricField.valid && <option value="">Please select a metric</option>}
          {metricField.valid && (
            <>
              <option value="">Please select</option>
              {aggregators.map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </SelectInSection>
      </Sections>

      {QueryBuilder && (
        <Sections>
          <QueryBuilderSection
            value={tagFilterExpression}
            onChange={setTagFilterExpression}
            QueryBuilder={QueryBuilder}
            withoutIcon
          />
        </Sections>
      )}

      {formatterSection}

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}

function getAggregations(beaconType, metric) {
  const metricDefinition = find(availableMetrics[beaconType], ({ metric: m }) => m === metric);
  return metricDefinition?.supportedAggregations ?? [];
}
