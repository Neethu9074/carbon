import React, { useState, useEffect, useRef } from 'react';
import { find, groupBy } from 'lodash';

import QueryBuilder, {
  getTagCatalog,
  isCallQueryValid
} from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { invalidMarker } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/form';
import { fromBackendModel, fromTagFiltersArray } from 'in-new-components/QueryBuilder/transformation/formModel';
import IndeterminateLoadingIndicator from 'in-new-components/LoadingIndicators/IndeterminateLoadingIndicator';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { onChangeGrouping } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TagGroupConfiguration from 'in-analyze/AnalyzeView/components/TagGroupConfiguration';
import { sizes as ICON_SIZES } from 'in-components/SvgIcon/SvgIcon';
import { availableMetrics } from 'in-applications/analyze/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import { Row, Col } from 'in-new-components/layout/Grid';
import { pendingResult } from 'in-services/fixedObjects';
import FormGroup from 'in-components/form/FormGroup';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

export default function FormComponent({
  form,
  onChange,
  dataSourceFormGroup,
  labelFormGroup,
  formatterFormGroup,
  widgetPreview,
  timeShiftConfiguration
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const tagFiltersField = form.get('tagFilters');

  const removeTagFilterArrayRef = useRef();

  // Handle asynchronous validation of the tag filter expression
  const [formModelExpression, setFormModelExpression] = useState(() =>
    fromBackendModel(tagFilterExpressionField.value)
  );
  const timeConfig = useTimeConfig();
  const validTagFilterExpressionResult =
    useObservable(isCallQueryValid, [formModelExpression, timeConfig]) ?? pendingResult;
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
  const tagCatalogResult = useObservable(getGetTagCatalogObservable, [timeConfig]);
  const needsTagFiltersConversionToTagFilterExpression = Boolean(tagFiltersField?.value);
  useEffect(() => {
    if (needsTagFiltersConversionToTagFilterExpression && tagCatalogResult?.data) {
      const newFormModel = fromTagFiltersArray(tagFiltersField.value, tagCatalogResult.data);
      removeTagFilterArrayRef.current = true;
      setFormModelExpression(newFormModel);
    }
  }, [needsTagFiltersConversionToTagFilterExpression, tagCatalogResult]);

  return (
    <>
      {labelFormGroup && (
        <Row>
          <Col lg={6}>{labelFormGroup}</Col>
        </Row>
      )}

      <Row withoutTopMargin>
        <Col lg={6}>{dataSourceFormGroup}</Col>
      </Row>

      {needsTagFiltersConversionToTagFilterExpression && <IndeterminateLoadingIndicator size={ICON_SIZES.l} />}

      {!needsTagFiltersConversionToTagFilterExpression && (
        <>
          <Row withoutTopMargin>
            <Col lg={12}>
              <FormGroup>
                <Label>Filter</Label>
                <div>
                  <QueryBuilder
                    value={formModelExpression}
                    onChange={expression => {
                      setFormModelExpression(expression);
                    }}
                  />
                </div>
                <TouchedMessages field={tagFilterExpressionField} />
              </FormGroup>
            </Col>
          </Row>

          <TagGroupConfiguration
            tagFilterExpression={tagFilterExpressionField.valid ? tagFilterExpressionField.value : EMPTY_EXPRESSION}
            grouping={form
              .get('grouping')
              ?.get(0)
              ?.toJS()}
            onChange={grouping => onChangeGrouping(onChange, grouping)}
          />
        </>
      )}

      <Row withoutTopMargin>
        <Col lg>
          <Row>
            <Col lg>
              <FormGroup>
                <Label
                  htmlFor="metic-configurator-application-metric"
                  hasError={!metricField.valid && metricField.touched}
                >
                  Metric
                </Label>
                <Select
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
                </Select>
                <TouchedMessages field={metricField} />
              </FormGroup>
            </Col>

            <Col lg>
              <FormGroup>
                <Label
                  htmlFor="metic-configurator-application-aggregation"
                  hasError={!aggregationField.valid && aggregationField.touched}
                >
                  Aggregation
                </Label>
                <Select
                  id="metic-configurator-application-aggregation"
                  value={aggregationField.value}
                  onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
                  hasError={!aggregationField.valid && aggregationField.touched}
                  disabled={!metricField.valid}
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
                </Select>
                <TouchedMessages field={aggregationField} />
              </FormGroup>
            </Col>
          </Row>

          {formatterFormGroup}
        </Col>

        {widgetPreview && <Col lg>{widgetPreview}</Col>}
      </Row>

      {timeShiftConfiguration}
    </>
  );
}

function getGetTagCatalogObservable([timeConfig]) {
  return getTagCatalog({ timeConfig });
}

function getAggregations(metric) {
  return find(availableMetrics, ({ metric: m }) => m === metric).supportedAggregations;
}
