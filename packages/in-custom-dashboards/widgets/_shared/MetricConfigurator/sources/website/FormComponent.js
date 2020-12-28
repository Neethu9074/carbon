import React, { useState, useEffect, useRef } from 'react';
import { find, groupBy } from 'lodash';

import { fromBackendModel, fromTagFiltersArray } from 'in-new-components/QueryBuilder/transformation/formModel';
import IndeterminateLoadingIndicator from 'in-new-components/LoadingIndicators/IndeterminateLoadingIndicator';
import { invalidMarker } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website/form';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { availableMetrics } from 'in-websites/analyze/AnalyzeView/metrics';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import * as queryBuildersPerDataSource from 'in-websites/queryBuilder';
import { emptyObject, pendingResult } from 'in-services/fixedObjects';
import { sizes as ICON_SIZES } from 'in-components/SvgIcon/SvgIcon';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import { dataSourceTitles } from 'in-websites/tags';
import Stack from 'in-new-components/layout/Stack';
import useTimeConfig from 'in-hooks/useTimeConfig';
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
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const tagFiltersField = form.get('tagFilters');

  const { QueryBuilder, getTagCatalog } = queryBuildersPerDataSource[beaconTypeField.value] || emptyObject;

  const removeTagFilterArrayRef = useRef();

  // Handle asynchronous validation of the tag filter expression
  const [formModelExpression, setFormModelExpression] = useState(() =>
    fromBackendModel(tagFilterExpressionField.value)
  );
  const timeConfig = useTimeConfig();
  const validTagFilterExpressionResult =
    useObservable(getIsQueryValidObservable, [formModelExpression, timeConfig, beaconTypeField.value]) ?? pendingResult;
  const formModelIsValid = validTagFilterExpressionResult.data === true;
  useEffect(() => {
    onChange([], form => {
      if (removeTagFilterArrayRef.current) {
        form = form.remove('tagFilters');
      }

      return form.updateIn(['tagFilterExpression'], field => {
        if (formModelIsValid) {
          return field.setValue(toBackendQueryModel(formModelExpression, false));
        } else {
          return field.setValue(invalidMarker);
        }
      });
    });
  }, [formModelIsValid, formModelExpression]);

  // handle tagFilter[] to tagFilterExpression migration
  const tagCatalogResult = useObservable(getTagCatalog, []);
  const needsTagFiltersConversionToTagFilterExpression = Boolean(tagFiltersField?.value);
  useEffect(() => {
    if (needsTagFiltersConversionToTagFilterExpression && tagCatalogResult?.data) {
      const newFormModel = fromTagFiltersArray(
        // Within the tag filters based variant of this data source configuration, we used to
        // store the beacon type as part of the tag filters array. This was done to have a
        // cleaner backend API. This "cleaner" API turned out to create more work than it provided
        // value in the end and is getting removed with the introduction of tag filter expressions.
        tagFiltersField.value.filter(({ name }) => name !== 'beacon.type'),
        tagCatalogResult.data
      );
      removeTagFilterArrayRef.current = true;
      setFormModelExpression(newFormModel);
    }
  }, [needsTagFiltersConversionToTagFilterExpression, tagCatalogResult]);

  return (
    <Stack space="xsmall">
      {dataSourceSection}

      <Sections>
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

      {needsTagFiltersConversionToTagFilterExpression && <IndeterminateLoadingIndicator size={ICON_SIZES.l} />}

      {QueryBuilder && !needsTagFiltersConversionToTagFilterExpression && (
        <Sections>
          <QueryBuilderSection
            value={formModelExpression}
            onChange={setFormModelExpression}
            QueryBuilder={QueryBuilder}
            withoutIcon
          />
        </Sections>
      )}

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
      </Sections>

      <Sections>
        <SelectInSection
          label="Aggregation"
          id="metic-configurator-website-aggregation"
          value={aggregationField.value}
          onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!aggregationField.valid && aggregationField.touched}
          disabled={!metricField.valid}
          additionalContent={<TouchedMessages field={aggregationField} />}
        >
          {!metricField.valid && <option value="">Please select a metric</option>}
          {metricField.valid && (
            <>
              <option value="">Please select</option>
              {getAggregations(beaconTypeField.value, metricField.value).map(aggregation => (
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

function getAggregations(beaconType, metric) {
  const metricDefinition = find(availableMetrics[beaconType], ({ metric: m }) => m === metric);
  return metricDefinition?.supportedAggregations ?? [];
}

function getIsQueryValidObservable([tagFilterExpression, timeConfig, beaconType]) {
  const queryBuilder = queryBuildersPerDataSource[beaconType];
  if (!queryBuilder) {
    return undefined;
  }
  return queryBuilder.isQueryValid(tagFilterExpression, timeConfig);
}
