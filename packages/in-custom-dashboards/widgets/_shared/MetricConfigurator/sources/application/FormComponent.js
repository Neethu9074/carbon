import { createMapForm, createField, notBlankValidator, createListForm } from 'formalistic';
import { find, groupBy } from 'lodash';
import React from 'react';

import { numberValidator, stringValidator, objectValidator, booleanValidator } from 'in-services/validators/jsonType';
import TagFilterConfiguration from 'in-analyze/AnalyzeView/components/TagFilterConfiguration';
import TagGroupConfiguration from 'in-analyze/AnalyzeView/components/TagGroupConfiguration';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { availableMetrics } from 'in-applications/analyze/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import { Row, Col } from 'in-new-components/layout/Grid';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

export default function FormComponent({
  form,
  onChange,
  dataSourceFormGroup,
  labelFormGroup,
  formatterFormGroup,
  widgetPreview,
  timeShiftConfiguration,
  axisForm,
  axisName
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  //Check if it is displaying for a chart
  const renderer = axisForm?.get(axisName)?.get('renderer');
  const groupingDisabled = renderer?.value !== 'stackedArea' && renderer?.value !== 'stackedBar';
  const isMultiMetrics =
    axisForm
      ?.get(axisName)
      ?.get('metrics')
      ?.toJS().length > 1 ?? false;

  if (form.get('grouping') != null && (groupingDisabled || isMultiMetrics)) {
    onChange([], form => form.remove('grouping'));
  }

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

      <TagFilterConfiguration
        tagFilters={form.get('tagFilters').value}
        onChange={tagFilters => onChange(['tagFilters'], f => f.setValue(tagFilters).setTouched(true))}
      />

      <TagGroupConfiguration
        tagFilters={form.get('tagFilters').value}
        grouping={form.get('grouping')?.get(0)}
        onByChange={by => {
          //If the group is unset, remove all grouping settings.
          if (by == null) {
            onChange([], form => form.remove('grouping'));
            return;
          }

          //If there is no grouping yet, set default values, otherwise update the group.
          if (form.get('grouping') == null) {
            onChange([], form =>
              form.put('grouping', createListForm().push(getDefaultGroupingForm(by))).setTouched(true)
            );
          } else {
            onChange(['grouping', 0, 'by'], f => f.setValue(by).setTouched(true));
          }
        }}
        onDirectionChange={direction =>
          onChange(['grouping', 0, 'direction'], f => f.setValue(direction).setTouched(true))
        }
        onIncludeOthersChange={includeOthers =>
          onChange(['grouping', 0, 'includeOthers'], f => f.setValue(includeOthers).setTouched(true))
        }
        onMaxResultsChange={maxResults =>
          onChange(['grouping', 0, 'maxResults'], f => f.setValue(maxResults).setTouched(true))
        }
        disabled={groupingDisabled || isMultiMetrics}
        isMultiMetrics={isMultiMetrics}
      />

      <Header>Customize the widget</Header>

      <Row>
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
                        .updateIn(['aggregation'], field => field.setValue(''))
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

function getAggregations(metric) {
  return find(availableMetrics, ({ metric: m }) => m === metric).supportedAggregations;
}

function getDefaultGroupingForm(by) {
  return createMapForm()
    .put(
      'by',
      createField({
        value: by,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, objectValidator)
      })
    )
    .put(
      'direction',
      createField({
        value: 'DESC',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'includeOthers',
      createField({
        value: true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator)
      })
    )
    .put(
      'maxResults',
      createField({
        value: 5,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    );
}
